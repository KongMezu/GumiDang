# 베이스 이미지
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 종속성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드
RUN npm run build

# 애플리케이션 실행
CMD ["npm", "start"]
