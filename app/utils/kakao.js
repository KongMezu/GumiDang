export const loadKakaoMap = () => {
    return new Promise((resolve) => {
        if (window.kakao && window.kakao.maps) {
            resolve(window.kakao);
        } else {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=d3745faf495bcce30edb681fb85a6b3b&libraries=services&autoload=false`;
            script.onload = () => {
                window.kakao.maps.load(() => {
                    resolve(window.kakao);
                });
            };
            document.head.appendChild(script);
        }
    });
};

export const getAddressFromCoords = (latLng) => {
    return new Promise((resolve, reject) => {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2Address(latLng.getLng(), latLng.getLat(), (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                resolve(result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name);
            } else {
                reject(new Error('Failed to get address'));
            }
        });
    });
};


//다음은 기존 kakao.js 코드 - 백업용
/*
export const loadKakaoMap = () => {
    return new Promise((resolve) => {
    if (window.kakao && window.kakao.maps) {
        resolve(window.kakao);
    } else {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=d3745faf495bcce30edb681fb85a6b3b&libraries=services&autoload=false`;
        script.onload = () => {
        window.kakao.maps.load(() => {
            resolve(window.kakao);
        });
        };
        document.head.appendChild(script);
    }
    });
};
*/