# issac.design Shop v1.1 개선 계획

## Context
plan1-0(쇼핑몰 전면 개편)이 완료되어 30개 페이지, 23개 컴포넌트가 구현되었으나, 시니어 디자인 리뷰 + 경쟁사 분석 결과 **브랜드 이미지 불일치**, **누락 컴포넌트 5개**, **경쟁력 부족 기능** 등이 발견되었습니다.

### 핵심 문제
1. **이미지 불일치**: 랜딩페이지와 쇼핑몰이 완전히 다른 Unsplash 이미지를 사용 → 브랜드 일관성 붕괴
2. **누락 컴포넌트**: InstallationGallery, SortControls, QuickViewModal 등 5개 미구현
3. **경쟁 열위**: 카카오톡 채팅, 파일 업로드, 고객사 로고 등 한국 간판 업계 표준 기능 부재
4. **디자인 품질**: ShopHero 텍스트 전용, 제품 카드 글로우 효과 부재

### 경쟁사 분석 요약
- **한국**: 간판다이렉트(견적 비교), PPNEON(감성 브랜딩), 리얼네온(당일제작)
- **글로벌**: CustomNeon(인터랙티브 디자인 툴), YELLOWPOP(라이프스타일), Sygns(포트폴리오 중심)
- **공통 특징**: 카카오톡/WhatsApp 채팅, 파일 업로드, 고객사 로고, 제품 비주얼 히어로

---

## Step 1: 브랜드 이미지 통일 (Priority 1 - MUST)

### 1.1 products.json 이미지 교체
**파일**: `src/data/products.json`

랜딩페이지에서 사용하는 브랜드 이미지로 전체 교체:

| 카테고리 | 대표 이미지 (랜딩 SignageTypes) | 보조 이미지 (Portfolio/ClientShowcase) |
|---------|------|------|
| led-channel | `photo-1763673263764-4d189ab2f03f` | `photo-1767488903403-3963f0d370db`, `photo-1524237964353-f14cde1db034` |
| neon | `photo-1551560798-b935eb510ab3` | `photo-1646119843923-7cc001121d5d`, `photo-1768812141741-4ee1bf3d9095` |
| acrylic | `photo-1703578438904-b1b83426103c` | `photo-1762680850399-c085c8d15afe`, `photo-1635176776026-27d4c4a310f3` |
| banner | `photo-1760510463648-363d4caac5f7` | `photo-1513757378314-e46255f6ed16`, `photo-1767780648463-2ba4c5866438` |
| protruding | `photo-1713608062698-ad6e34d5c024` | `photo-1760831029512-a83911de7daa`, `photo-1642222197378-14d9fa160203` |
| rooftop | `photo-1706720045042-24942be8c166` | `photo-1642222197378-14d9fa160203`, `photo-1762680850399-c085c8d15afe` |

- thumbnail: `?w=400&q=80`, images 배열: `?w=800&q=80`
- installationGallery의 before/after도 동일 이미지 풀에서 매핑

### 1.2 portfolio.json 이미지 교체
**파일**: `src/data/portfolio.json`
- 8개 포트폴리오 항목의 before/after/process 이미지를 브랜드 이미지로 교체

### 1.3 ShopHero 배경 이미지 추가
**파일**: `src/components/shop/ShopHero.astro` (수정)
- 현재: 텍스트 + CSS 그라디언트 배경만 존재
- 변경: LED 채널 대표 이미지(`photo-1763673263764`)를 배경으로 추가
- 다크 그라디언트 오버레이로 텍스트 가독성 유지
- `data-hero-image` 속성 추가 → GSAP 패럴랙스

### ✅ 검증
- `npm run build` → 에러 없음
- FeaturedBento, CategoryShowcase, ProductGrid 모두 간판 관련 이미지 표시
- 랜딩페이지와 쇼핑몰 이미지가 시각적으로 일관됨

---

## Step 2: 누락 컴포넌트 구현 (Priority 2 - MUST)

### 2.1 InstallationGallery.astro (Before/After 슬라이더)
**새 파일**: `src/components/shop/InstallationGallery.astro`
- Props: `gallery: Array<{ before: string; after: string; location: string }>`
- 드래그 핸들로 before/after 이미지 비교 (CSS clip-path + pointer events)
- 터치/마우스 모두 지원
- BEM: `.installation-gallery`, data-attr: `data-installation-gallery`
- **연동**: `src/pages/shop/[slug].astro`에서 ProductionTimeline 다음에 조건부 렌더링

### 2.2 SortControls.astro (정렬 + 뷰 토글)
**새 파일**: `src/components/shop/SortControls.astro`
- 정렬: 인기순(popularity), 최신순(isNew), 이름순(name)
- 뷰 토글: 그리드 ↔ 리스트
- **연동 수정 필요**:
  - `ProductCard.astro`: `data-popularity`, `data-is-new` 속성 추가
  - `ProductGrid.astro`: `.product-grid--list` 클래스 토글 지원
  - `src/pages/shop/index.astro`: CategoryFilter 옆에 SortControls 배치

### 2.3 QuickViewModal.astro (빠른 미리보기)
**새 파일**: `src/components/shop/QuickViewModal.astro`
- 싱글톤 모달: 하나의 DOM, 동적으로 콘텐츠 주입
- 제품 이미지 + 이름 + 카테고리 + 설명 + 가격 + 견적함 추가 버튼
- GSAP 오픈/클로즈 애니메이션, ESC 닫기, Lenis 정지/재개
- **연동 수정**: `ProductCard.astro`에 `data-quick-view` 버튼 추가

### ✅ 검증
- InstallationGallery: 마우스/터치 드래그로 before↔after 전환
- SortControls: 인기순 정렬 시 popularity 높은 제품이 먼저 표시
- QuickViewModal: 카드 Quick View 클릭 → 모달 열림 → 견적함 추가 → 닫기

---

## Step 3: 경쟁력 강화 기능 (Priority 3 - SHOULD)

### 3.1 KakaoFloat.astro (카카오톡 채팅 버튼)
**새 파일**: `src/components/shop/KakaoFloat.astro`
- Fixed bottom-right, #FEE500 노란색 원형 버튼
- 카카오톡 채널 링크 (placeholder URL)
- 모바일: bottom: 16px, right: 16px
- 로드 시 pulse 애니메이션 1회
- **연동**: 모든 shop 페이지에 추가

### 3.2 QuoteForm 파일 업로드 추가
**수정 파일**: `src/components/shop/QuoteForm.astro`
- 파일 업로드 영역 (드래그앤드롭 + 클릭)
- 허용: JPG, PNG, PDF, AI, PSD (최대 10MB)
- 파일 미리보기 + 삭제 버튼
- FormData에 첨부

### 3.3 ClientLogos.astro (고객사 로고 마키)
**새 파일**: `src/components/shop/ClientLogos.astro`
- "1,000+ 고객사가 선택한 issac.design" 타이틀
- 무한 가로 스크롤 마키 (CSS animation)
- 플레이스홀더 로고 (업종별: 레스토랑, 카페, 매장, 사무실 등)
- 그레이스케일 → hover시 컬러
- **연동**: `shop/index.astro`에서 TrustIndicators 다음에 배치

### ✅ 검증
- 카카오톡 버튼: 모든 shop 페이지 우하단에 표시
- 파일 업로드: 이미지 드래그 → 미리보기 표시 → 삭제 가능
- 고객사 로고: 자동 스크롤, 반응형

---

## Step 4: 디자인 폴리시 (Priority 4 - NICE)

### 4.1 애니메이션 셀렉터 수정
**수정 파일**: `src/components/shop/ShopAnimations.astro`
- `.product-card` → `[data-product-card]`로 변경 (Portfolio.astro 충돌 방지)

### 4.2 ProductCardSkeleton.astro
**새 파일**: `src/components/shop/ProductCardSkeleton.astro`
- shimmer 로딩 플레이스홀더 (ProductCard과 동일 크기)

### 4.3 AddToQuoteButton 디자인 강화
**수정 파일**: `src/components/shop/AddToQuoteButton.astro`
- 그라디언트 배경, 글로우 호버, 클릭 시 체크마크 마이크로 애니메이션

### 4.4 ProductCard 글로우 효과
**수정 파일**: `src/components/shop/ProductCard.astro`
- 호버 시 green glow shadow 추가
- 이미지 위 미세한 그린 틴트 오버레이

### 4.5 QuoteCartBadge.astro (플로팅 견적함 배지)
**새 파일**: `src/components/shop/QuoteCartBadge.astro`
- Fixed bottom-left, 견적함 아이콘 + 카운트 배지
- `quote-cart-updated` 이벤트 리스닝
- 카운트 0이면 숨김
- **연동**: 모든 shop 페이지에 추가

### ✅ 검증
- 애니메이션 충돌 없음
- 스켈레톤 shimmer 동작
- 견적함 추가 시 버튼 체크마크 → 배지 카운트 업데이트

---

## 구현 순서 (의존성 반영)

```
Step 1.1 (products.json 이미지) ──┐
Step 1.2 (portfolio.json 이미지) ──┤──→ Step 1.3 (ShopHero 배경)
                                    │
Step 2.1 (InstallationGallery) ────┤
Step 2.2 (SortControls) ──────────┤──→ Step 2.3 (QuickViewModal)
                                    │
Step 3.1 (KakaoFloat) ────────────┤
Step 3.2 (QuoteForm 업로드) ──────┤
Step 3.3 (ClientLogos) ──────────┤
                                    │
Step 4.1~4.5 (폴리시) ────────────┘──→ 최종 빌드 + 검수
```

---

## 파일 매니페스트

### 새로 생성 (7개)
| 파일 | 목적 |
|------|------|
| `InstallationGallery.astro` | Before/After 비교 슬라이더 |
| `SortControls.astro` | 정렬 + 뷰 토글 |
| `QuickViewModal.astro` | 빠른 미리보기 모달 |
| `KakaoFloat.astro` | 카카오톡 플로팅 버튼 |
| `ClientLogos.astro` | 고객사 로고 마키 |
| `ProductCardSkeleton.astro` | 로딩 스켈레톤 |
| `QuoteCartBadge.astro` | 플로팅 견적함 배지 |

### 수정 (8개)
| 파일 | 변경 내용 |
|------|----------|
| `products.json` | 16개 제품 이미지 URL 전체 교체 (thumbnail + images + installationGallery) |
| `portfolio.json` | 8개 포트폴리오 이미지 교체 |
| `ShopHero.astro` | 배경 이미지 레이어 추가 |
| `ProductCard.astro` | data-popularity/data-is-new 속성, Quick View 버튼, 글로우 효과 |
| `ProductGrid.astro` | 리스트 뷰 클래스 토글 지원 |
| `QuoteForm.astro` | 파일 업로드 필드 추가 |
| `AddToQuoteButton.astro` | 그라디언트, 글로우, 마이크로 애니메이션 |
| `ShopAnimations.astro` | 셀렉터 `.product-card` → `[data-product-card]` |

### 페이지 연동 수정
| 페이지 | 추가 컴포넌트 |
|--------|-------------|
| `shop/index.astro` | SortControls, QuickViewModal, ClientLogos, KakaoFloat, QuoteCartBadge |
| `shop/[slug].astro` | InstallationGallery, KakaoFloat, QuoteCartBadge |
| `shop/category/[category].astro` | SortControls, QuickViewModal, KakaoFloat, QuoteCartBadge |
| `shop/about.astro` | KakaoFloat |
| `shop/faq.astro` | KakaoFloat |
| `shop/contact.astro` | KakaoFloat |
| `shop/search.astro` | QuickViewModal, KakaoFloat |
| `shop/quote-cart.astro` | KakaoFloat |
| `shop/quote-checkout.astro` | KakaoFloat |

---

## 최종 검증 체크리스트

1. `npm run build` → 에러 없음, 30+ 페이지 생성
2. **이미지 일관성**: 랜딩페이지↔쇼핑몰 동일 이미지 사용 확인
3. **ShopHero**: 배경 이미지 + 텍스트 오버레이 가독성
4. **InstallationGallery**: 마우스/터치 드래그 동작
5. **SortControls**: 인기순/최신순/이름순 정렬 정확성
6. **QuickViewModal**: 열기/닫기, 견적함 추가, ESC 닫기
7. **KakaoFloat**: 모든 shop 페이지 우하단 표시, 모바일 위치
8. **파일 업로드**: 드래그앤드롭, 미리보기, 삭제, 사이즈 제한
9. **ClientLogos**: 자동 스크롤, 반응형
10. **반응형**: 375px / 768px / 1024px / 1440px 전체 확인
11. **GSAP 애니메이션**: 스크롤 트리거 정상 동작
12. **견적함 플로우**: 제품 추가 → 배지 업데이트 → 견적함 → 체크아웃
