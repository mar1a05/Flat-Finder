import Header  from './Header';
import { Outlet } from 'react-router-dom';

function HomePage(){

    return (
        <>
            <Header/>
            <Outlet/>
        </>
    )
}

export default HomePage;