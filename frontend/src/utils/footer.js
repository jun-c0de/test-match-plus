// src/data/footer.data.js
const footer = {
    brand: {
        name: "LOGO",
        logo: "/img/match_plus.png", // public/img/logo.svg 기준
        copy: `© ${new Date().getFullYear()} DECODE.Lab. All rights reserved.`,
    },
    links: [
        {
            icon: "link", // material-icons 기준
            label: "GitHub",
            value: "github.com/username",
            href: "https://github.com/username",
        },
        {
            icon: "link",
            label: "Notion",
            value: "notion.site/portfolio",
            href: "https://notion.site/portfolio",
        },
        // {
        //   icon: "link",
        //   label: "LinkedIn",
        //   value: "linkedin.com/in/username",
        //   href: "https://linkedin.com/in/username",
        // },
    ],
};

export default footer;