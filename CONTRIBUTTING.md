# 📘 Contributing Guide - SmartStore Monitor

이 프로젝트는 스마트스토어 주문/재고/알림 모니터링 시스템을 개발하는 개인 프로젝트입니다.  
일관된 개발 흐름 유지를 위해 아래의 커밋 및 브랜치 전략을 따릅니다.

---

## ✅ 커밋 메시지 작성 규칙 (Conventional Commits)

- 형식: `<타입>: <변경 요약>`
- 변경 요약은 **한글로 작성**해도 무방하며, 명확한 의미 전달을 우선합니다.

### 📌 커밋 타입 목록

| 타입      | 설명 |
|-----------|------|
| `feat`    | 새로운 기능 추가 |
| `fix`     | 버그 수정 |
| `refactor`| 리팩토링 (동작 변화 없음) |
| `style`   | 코드 스타일 수정 (포맷, 들여쓰기 등) |
| `chore`   | 빌드/설정/패키지 관련 작업 |
| `ci`      | CI/CD 설정 관련 작업 |
| `docs`    | 문서 수정, README 등 |
| `test`    | 테스트 코드 작성 또는 수정 |

### ✅ 커밋 예시

```bash
feat: 주문 대시보드 레이아웃 추가  
fix: 재고 수량 표시 오류 수정  
refactor: Zustand 상태 관리 구조 개선  
style: Tailwind 클래스 정리 및 들여쓰기 수정  
chore: Prettier 및 ESLint 설정 추가  
ci: GitHub Actions 배포 설정 추가  
docs: 프로젝트 기여 가이드 작성  
