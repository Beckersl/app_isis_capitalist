import React from 'react';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { transform } from "./utlis";
import { World } from './world';
import { Services } from './Services'
import Product from './Product'
import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';


function App() {
  let username = 'username';
  const [services, setServices] = useState(new Services(""))
  const [world, setWorld] = useState(new World())

  useEffect(() => {

    let services = new Services(username)
    setServices(services)
    services.getWorld().then(response => {
      setWorld(response.data)
    }
    )

  }, [])


  return (
    <div className="App">
      <div className="header">
        <div className="debutHead">
          <div className='imgLogo'><img src={services.server + world.logo} alt='logo du monde' /></div>
          <span> {world.name} </span>
        </div>
        <div className='finHead'>
          <span>Global Viewers</span>
          <div className='rondRouge'></div>
          <span dangerouslySetInnerHTML={{ __html: transform(world.money) }} />
        </div>
      </div>
      <div className="main">
        <div className='sideBar'>
          <div> multiplicateur </div>
          <div> ID du joueur </div>
          <div> liste des boutons de menu </div>
          <div className='buttons'>
            <div className='button'>Unlocks</div>
            <div className='button'>Cash Upgrades</div>
            <div className='button'>Angel Upgrades</div>
            <div className='button'>Managers</div>
            <div className='button'>Investors</div>
          </div>
        </div>
        <div className="product">
          <div className="products">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              {world.products.product.map(prod =>
                <Grid item xs={4}>
                  <Product prod={prod} services={services} />
                </Grid>
              )}
            </Grid>
          </Box>
          </div>
          <ul>

          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
