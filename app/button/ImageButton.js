import Image from 'next/image';
import styles from './ImageButton.module.css';

const ImageButton = ({ onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      <Image
        src="/image/kakao_login_medium_wide.png"
        alt="Custom Button"
        width={307} // 버튼 크기에 맞게 조정
        height={40} // 버튼 크기에 맞게 조정
      />
    </button>
  );
};

export default ImageButton;

/*카카오 버튼 생성 */