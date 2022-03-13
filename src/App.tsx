import React from 'react';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { transform } from "./utlis";
import { World, Product } from './world';
import { Services } from './Services'
import ProductComponent from './Product'
import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Manager from './Manager';


function App() {
  let username = 'username';
  const [services, setServices] = useState(new Services(""))
  const [world, setWorld] = useState(new World())
  const [qtmulti, setqtmulti] = useState({affichage: "x1", valeur: 1})
  const [money, setMoney] = useState(world.money)



  useEffect(() => {

    let services = new Services(username)
    setServices(services)
    services.getWorld().then(response => {
      setWorld(response.data)
    }
    )

  }, [])

  function addToScore(gain:number) {
    setMoney(money + gain);
    world.money += gain;
  }

  function onProductionDone(p: Product): void {
    console.log(p.quantite)
    // calcul de la somme obtenue par la production du produit
    let gain = p.quantite * p.revenu
    console.log(gain)
    // ajout de la somme à l’argent possédé
    addToScore(gain)
   }

   const btnMultiChange = () => {
     if (qtmulti.valeur == 1) {
      setqtmulti({...qtmulti, valeur: 10, affichage:"x10"})
     }
     if (qtmulti.valeur == 10) {
      setqtmulti({...qtmulti, valeur: 100, affichage:"x100"})
     }
     if (qtmulti.valeur == 100) {
      setqtmulti({...qtmulti, valeur: 0, affichage:"Max"})
     }
     if (qtmulti.valeur == 8) {
      setqtmulti({...qtmulti, valeur: 1, affichage:"x1"})
     }
   }
   function showManagers(){
    if (window ==false){
      setWindow(true)
      
    }
    else {
      setWindow(false)
     
    }
  } 

  console.log(world.products.product)
  return (
    <div className="App">
      <div className="header">
        <div className="debutHead">
          <div className='imgLogo'><img src={services.server + world.logo} alt='logo du monde' /></div>
          <span> {world.name} </span>
        </div>
        <div className='finHead'>
          <div className='boutonMulti' onClick={btnMultiChange}>{qtmulti.affichage}</div>
          <span>Global Viewers</span>
          <div className='rondRouge'></div>
          <span dangerouslySetInnerHTML={{ __html: transform(money) }} />
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
                  <ProductComponent onProductionDone={onProductionDone} prod={prod} services={services} multi={qtmulti.affichage} multiValue={qtmulti.valeur} money={world.money} />
                </Grid>
              )}
            </Grid>
          </Box>
          </div>
          <ul>

          </ul>
        </div>
        { && window 
        <div className='manageurs'>
      <Manager world={world} services={ services } showManagers={showManagers} />
    </div>
}
      </div>
    </div>
  );
}

export default App;
