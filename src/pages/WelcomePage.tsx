import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-page">
            <div className="container">

                <div className="decorations">
                    <img className="decor decor-1" src='/dec1.png' />
                    <div className="decor decor-2"></div>
                    <div className="decor decor-3"></div>
                    <img className="decor decor-4" src='/calend.png' />
                    <img className="decor decor-5" src='/ava.png' />
                    <img className="decor decor-6" src='/pink.png' />
                    <img className="decor decor-7" src='/flower.png' />
                    <div className="decor decor-8"></div>
                    <div className="decor decor-9"></div>
                    <div className="decor decor-10"></div>
                    <div className="decor decor-11"></div>
                    <img className="decor decor-12" src='/coffee.png' />
                    <div className="decor decor-13"></div>
                    <div className="decor decor-14"></div>
                    <div className="decor decor-15"></div>
                </div>
                <div className="illustration-container">
                    <img
                        src="/avatar.png"
                        alt="Task Sync Illustration"
                        className="main-illustration"
                    />


                </div>


                <div className="text-content">
                    <h1 className="title">Task Sync</h1>
                    <p className="description">
                        This productive tool is designed to help you better manage
                        your task project-wise conveniently!
                    </p>
                    <button
                        className="primary-button"
                        onClick={() => navigate('/auth')}
                    >
                        Let's Start

                        <svg className='arrow' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.0586 18C12.7412 18 12.4375 17.9266 12.1484 17.7812C11.7874 17.5775 11.4991 17.2549 11.3398 16.876C11.2386 16.6139 11.0798 15.8304 11.0791 15.8125C10.9331 15.0184 10.8491 13.7648 10.8369 12.3604L10.835 12.0068C10.835 10.5352 10.921 9.19297 11.0508 8.31836L11.165 7.77441C11.2283 7.48651 11.3108 7.15858 11.3975 6.99121C11.7148 6.37891 12.3358 6.00018 13 6H13.0586C13.4898 6.01443 14.393 6.39069 14.4014 6.40723C15.8654 7.02151 18.6897 8.87561 19.9941 10.1973L20.373 10.5938C20.4722 10.7012 20.5841 10.8286 20.6533 10.9277C20.8846 11.2339 21 11.6133 21 11.9922C21 12.415 20.8703 12.8083 20.625 13.1299L20.2354 13.5508L20.1484 13.6406C18.9648 14.9239 15.8735 17.0219 14.2568 17.6641L14.0127 17.7578C13.7191 17.863 13.308 17.9883 13.0586 18ZM4.50293 13.5176C3.67305 13.5174 3.00024 12.8379 3 12C3 11.1618 3.67291 10.4816 4.50293 10.4814L8.20215 10.8086C8.85341 10.8086 9.38184 11.3424 9.38184 12C9.3816 12.6585 8.85327 13.1904 8.20215 13.1904L4.50293 13.5176Z" fill="white" />
                        </svg>

                    </button>
                </div>




            </div>
        </div>
    );
};

export default WelcomePage;