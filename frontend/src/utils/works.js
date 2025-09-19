// src/data/works.js
const img = (path) => `/img/${path}`;
const works = [
    {
        id: "w-001",
        title: "Social Media Dashboard",
        subtitle: "SNS 통합 대시보드 · 반응형 UI",
        description:
            "React + Vite 기반의 SNS 통계/알림을 한눈에 보는 대시보드. 카드/차트/필터 컴포넌트로 모듈화.",
        tags: ["REACT", "RESPONSIVE", "DASHBOARD", "CHART", "CLEANUI"],
        thumbnail: img("p-1.png"),
        // 선택: 상세 보기용
        period: "2025.07 ~ 2025.08",
        role: "Front-end",
        stack: ["React", "Vite", "Zustand", "Recharts"],
        links: {
            demo: "https://example.com/demo1",
            notion: "https://notion.com/you/demo1",
        },
    },
    {
        id: "w-002",
        title: "E-commerce Product Gallery",
        subtitle: "상품 리스트 · 필터/정렬",
        description:
            "상세 필터·정렬·페이지네이션을 제공하는 상품 갤러리. 접근성 고려한 키보드 네비게이션 적용.",
        tags: ["REACT", "RESPONSIVE", "FILTER", "PAGINATION", "ACCESSIBILITY"],
        thumbnail: img("p-2.png"),
        period: "2025.06",
        role: "Front-end",
        stack: ["React", "Vite", "React Router"],
        links: {
            demo: "https://example.com/demo2",
            notion: "https://notion.com/you/demo2",
        },
    },
    {
        id: "w-003",
        title: "Portfolio Admin",
        subtitle: "Works 관리 · CRUD",
        description:
            "관리자에서 Works 항목을 생성/수정/삭제하는 SPA. 목데이터로부터 CRUD UX 설계.",
        tags: ["REACT", "CRUD", "ADMIN", "FORM", "VALIDATION"],
        thumbnail: img("p-3.png"),

        period: "2025.05",
        role: "Full-stack(미니)",
        stack: ["React", "Zustand", "Express(Mock)"],
        links: {
            demo: "#",
            notion: "#",
        },
    },
    {
        id: "w-004",
        title: "Social Media Dashboard",
        subtitle: "SNS 통합 대시보드 · 반응형 UI",
        description:
            "React + Vite 기반의 SNS 통계/알림을 한눈에 보는 대시보드. 카드/차트/필터 컴포넌트로 모듈화.",
        tags: ["REACT", "RESPONSIVE", "DASHBOARD", "CHART", "CLEANUI"],
        thumbnail: img("p-1.png"),
        // 선택: 상세 보기용
        period: "2025.07 ~ 2025.08",
        role: "Front-end",
        stack: ["React", "Vite", "Zustand", "Recharts"],
        links: {
            demo: "https://example.com/demo1",
            notion: "https://notion.com/you/demo1",
        },
    },
    {
        id: "w-005",
        title: "E-commerce Product Gallery",
        subtitle: "상품 리스트 · 필터/정렬",
        description:
            "상세 필터·정렬·페이지네이션을 제공하는 상품 갤러리. 접근성 고려한 키보드 네비게이션 적용.",
        tags: ["REACT", "RESPONSIVE", "FILTER", "PAGINATION", "ACCESSIBILITY"],
        thumbnail: img("p-2.png"),
        period: "2025.06",
        role: "Front-end",
        stack: ["React", "Vite", "React Router"],
        links: {
            demo: "https://example.com/demo2",
            notion: "https://notion.com/you/demo2",
        },
    },
    {
        id: "w-006",
        title: "Portfolio Admin",
        subtitle: "Works 관리 · CRUD",
        description:
            "관리자에서 Works 항목을 생성/수정/삭제하는 SPA. 목데이터로부터 CRUD UX 설계.",
        tags: ["REACT", "CRUD", "ADMIN", "FORM", "VALIDATION"],
        thumbnail: img("p-3.png"),

        period: "2025.05",
        role: "Full-stack(미니)",
        stack: ["React", "Zustand", "Express(Mock)"],
        links: {
            demo: "#",
            notion: "#",
        },
    },
    // 필요 개수만큼 추가
];

export default works