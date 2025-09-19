import React from 'react'
import { FaGithub } from "react-icons/fa"
import { SiNotion } from "react-icons/si"
import footer from "../../utils/footer"
import "./styles/Footer.scss"
const Footer = () => {
    return (
        <footer>
            <div className='inner'>
                <div className="left">
                    <h2>{footer.brand.name}</h2>
                    <p>
                        {footer.brand.copy}
                    </p>
                </div>
                <div className="right">
                    <a href="#">
                        <FaGithub size={28} />
                    </a>
                    <a href="#">
                        <SiNotion size={28} />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer