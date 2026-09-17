import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const Layout = ({children}) => {
    return (
        <>
        <Navbar/>
        <main>{children}</main>
        <Footer/>
        </>
    );
}



export default Layout;