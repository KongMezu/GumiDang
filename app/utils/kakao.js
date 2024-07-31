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
