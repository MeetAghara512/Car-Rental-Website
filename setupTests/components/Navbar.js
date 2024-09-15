import React, { Component } from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';


class Navbar extends Component {
      state={clicked : false};

      ClickHandler =() =>{
            this.setState({clicked:!this.state.clicked})
      }
      render(){
            return (
                  <>
                        <nav>
                              <a href='/'>
                              <svg id="logo-14" width="73" height="49" viewBox="0 0 73 49" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M46.8676 24C46.8676 36.4264 36.794 46.5 24.3676 46.5C11.9413 46.5 1.86765 36.4264 1.86765 24C1.86765 11.5736 11.9413 1.5 24.3676 1.5C36.794 1.5 46.8676 11.5736 46.8676 24Z" class="ccustom" fill="#68DBFF"></path> <path d="M71.1324 24C71.1324 36.4264 61.1574 46.5 48.8529 46.5C36.5484 46.5 26.5735 36.4264 26.5735 24C26.5735 11.5736 36.5484 1.5 48.8529 1.5C61.1574 1.5 71.1324 11.5736 71.1324 24Z" class="ccompli1" fill="#FF7917"></path> <path d="M36.6705 42.8416C42.8109 38.8239 46.8676 31.8858 46.8676 24C46.8676 16.1144 42.8109 9.17614 36.6705 5.15854C30.5904 9.17614 26.5735 16.1144 26.5735 24C26.5735 31.8858 30.5904 38.8239 36.6705 42.8416Z" class="ccompli2" fill="#5D2C02"></path> </svg>
                              </a>
                              <p className='text-3xl '><span className='text-cyan-400 font-bold'>Rentwheels </span><span className='text-orange-600 font-bold'>Express</span></p>
                        <div>
                              <ul id="navbar" className={this.state.clicked ? "#navbar active" : "navbar"}>
                                    <li><NavLink to='/Home' className='active'>Home</NavLink></li>
                                    {/* <li><a href='/'>About</a></li> */}
                                    <li><NavLink to='/Login'>Login</NavLink></li>
                                    <li><NavLink to='/Signup'>SignUp</NavLink></li>
                                    <li><a href='/AccountProfile'>My Profile</a></li>
                              </ul>
                        </div>
                        <div id="mobile" onClick={this.ClickHandler}>
                              {/* <i className='fas fa-bars'></i>
                              <i className='fas fa-times'></i> */}

                              <i id='bar' className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                        </div>
                        </nav>
                  </>
            );
      }
}
export default Navbar;
