import React from 'react';
import { NavLink } from 'react-router-dom';
import './Home.css';

function Home() {
    return (    
        <>
            <div className='OuterBox flex gap-5 justify-center '>
                <NavLink to='/Getcar'>
                    <div className='GetCar w-[15rem] h-[15rem] rounded-[1rem] transition ease-in-out delay-100 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300'>
                        <div className='text-content test-center pt-[4rem]'>
                            <p className='text-[2rem] italic text-white'>Purchase</p>
                            <p className='text-[2rem] italic text-white'>Car</p>
                        </div>
                    </div>
                </NavLink>
                <NavLink to='/SellCar'>
                    <div className='SellCar w-[15rem] h-[15rem] rounded-[1rem] transition ease-in-out delay-100 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300'>
                    <div className='text-content test-center pt-[4rem]'>
                            <p className='text-[2rem] italic text-white'>Sell</p>
                            <p className='text-[2rem] italic text-white'>Car</p>
                        </div>
                    </div>
                </NavLink>
            </div>
        </>
    );
}

export default Home;
