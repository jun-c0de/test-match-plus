// contact.data.js
const contact = {
    basics: [
        {
            icon: 'call',
            label: '전화',
            value: '010-1234-5678',
            href: 'tel:01012345678',
            hint: '평일 09:00–18:00 / 점심 12:00–13:00'
        },
        {
            icon: 'mail',
            label: '이메일',
            value: 'hello@liz.dev',
            href: 'mailto:hello@liz.dev',
            hint: '24시간 접수 · 1영업일 내 회신'
        },
        {
            icon: 'location_on',
            label: '주소',
            value: '서울특별시 강남구 삼성동 123',
            href: 'https://naver.me/지도링크',
            hint: '방문 미팅은 예약 후 가능합니다.'
        },
    ],
    channels: [
        {
            icon: 'link',
            label: 'GitHub',
            value: 'github.com/username',
            href: 'https://github.com/username'
        },
        {
            icon: 'link',
            label: 'Notion',
            value: 'notion.site/portfolio',
            href: 'https://notion.site/portfolio'
        },
        // { icon: 'link', label: 'LinkedIn', value: 'linkedin.com/in/username', href: 'https://linkedin.com/in/username' },
    ]
};
export default contact