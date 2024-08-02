'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { loadKakaoMap } from '../utils/kakao'; // 카카오 스크립트 로드 함수

const WritePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [startLocation, setStartLocation] = useState({ address: '', latLng: null });
  const [endLocation, setEndLocation] = useState({ address: '', latLng: null });
  const [waypoints, setWaypoints] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const initializeMap = async () => {
      const kakao = await loadKakaoMap();
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };
      const map = new kakao.maps.Map(mapContainer, mapOption);

      const marker = new kakao.maps.Marker({
        position: map.getCenter(),
        map: map,
      });

      const geocoder = new kakao.maps.services.Geocoder();
      //지도 중앙 좌표 주소 변환
      const searchLocation = (latLng, callback) => {
        geocoder.coord2Address(latLng.getLng(), latLng.getLat(), (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const address = result[0].road_address.address_name;
            callback(address, latLng);
          } else {
            alert('주소를 찾을 수 없습니다.');
          }
        });
      };
      //마커 위치 업데이트 함수
      const handleMapClick = () => {
        kakao.maps.event.addListener(map, 'center_changed', () => {
          const center = map.getCenter();
          marker.setPosition(center);
        });
      };

      handleMapClick();
      //지도 중앙 좌표 주소 저장
      document.getElementById('select-button').addEventListener('click', () => {
        const center = map.getCenter();
        searchLocation(center, (address, latLng) => {
          if (activeField === 'start') {
            setStartLocation({ address, latLng });
          } else if (activeField === 'end') {
            setEndLocation({ address, latLng });
          } else if (activeField !== null) {
            const newWaypoints = [...waypoints];
            newWaypoints[activeField] = { address, latLng };
            setWaypoints(newWaypoints);
          }
          setActiveField(null);
        });
      });
    };

    initializeMap();
  }, [activeField]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAddWaypoint = () => {
    if (waypoints.length < 4) {
      setWaypoints([...waypoints, { address: '', latLng: null }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('startAddress', startLocation.address);
    formData.append('startLat', startLocation.latLng?.getLat() || '');
    formData.append('startLng', startLocation.latLng?.getLng() || '');
    formData.append('endAddress', endLocation.address);
    formData.append('endLat', endLocation.latLng?.getLat() || '');
    formData.append('endLng', endLocation.latLng?.getLng() || '');
    formData.append('waypoints', JSON.stringify(waypoints));
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        router.push('/posts');
      } else {
        setError('글 작성에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h1>산책코스 작성</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>코스 이름<br /></label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>사진<br /></label>
          <input
            type="file"
            onChange={handleFileChange}
          />
        </div>
        {previewUrl && (
          <div>
            <img src={previewUrl} alt="미리보기" style={{ maxWidth: '100%', maxHeight: '300px' }} />
          </div>
        )}
        <div>
          <label>코스 입력<br /></label>
          <div>
            <label>산책 시작<br /></label>
            <input
              type="text"
              value={startLocation.address}
              onFocus={() => setActiveField('start')}
              readOnly
              placeholder="주소 입력"
            />
            {activeField === 'start' && (
              <div>
                <div id="map" style={{ width: '400px', height: '400px' }}></div>
                <button type="button" id="select-button">선택</button>
              </div>
            )}
          </div>
          {waypoints.map((waypoint, index) => (
            <div key={index}>
              <label>지나간 산책지 {index + 1}<br /></label>
              <input
                type="text"
                value={waypoint.address}
                onFocus={() => setActiveField(index)}
                readOnly
                placeholder="주소 입력"
              />
              {activeField === index && (
                <div>
                  <div id="map" style={{ width: '400px', height: '400px' }}></div>
                  <button type="button" id="select-button">선택</button>
                </div>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddWaypoint}>경유지 추가</button>
          <div>
            <label>산책 도착<br /></label>
            <input
              type="text"
              value={endLocation.address}
              onFocus={() => setActiveField('end')}
              readOnly
              placeholder="주소 입력"
            />
            {activeField === 'end' && (
              <div>
                <div id="map" style={{ width: '400px', height: '400px' }}></div>
                <button type="button" id="select-button">선택</button>
              </div>
            )}
          </div>
        </div>
        <div>
          <label>코스 설명<br /></label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">작성 완료</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default WritePage;
