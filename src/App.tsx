import React from 'react';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { transform } from "./utlis";
import { World, Product, Pallier } from './world';
import { Services } from './Services'
import ProductComponent from './Product'
import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';


function App() {
  const [services, setServices] = useState(new Services(""))
  const [world, setWorld] = useState(new World())
  const [qtmulti, setqtmulti] = useState({ affichage: "x1", valeur: 1 })
  const [money, setMoney] = useState(world.money)
  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = useState("")



  useEffect(() => {
    if (username !== "") {
      let services = new Services(username)
      setServices(services)
      services.getWorld().then(response => {
        setWorld(response.data)
      }
      )
    }
  }, [username])

  useEffect(() => {
    let username = localStorage.getItem("username");
    // si pas de username, on génère un username aléatoire
    if (!username || username === "") {
      username = "Viewer" + Math.floor(Math.random() * 10000);
    }
    localStorage.setItem("username", username);
    setUsername(username)
  }, [])


  function addToScore(gain: number) {
    setMoney(money + gain);
    world.money += gain;
    world.score += gain;
  }

  function onProductionDone(p: Product): void {
    // calcul de la somme obtenue par la production du produit
    let gain = p.quantite * p.revenu
    // ajout de la somme à l’argent possédé
    addToScore(gain)
  }



  function onProductBuy(qt: number, product: Product) {
    let perte = 0;
    for (let i = product.quantite; i < product.quantite + qt; i++) {
      perte += product.cout * Math.pow(product.croissance, qt - 1);
    }
    world.money -= perte;
    setMoney(money - perte);
    console.log("money" + world.money)
    checkGlobalUpgrade();
  }



  const btnMultiChange = () => {
    if (qtmulti.valeur == 1) {
      setqtmulti({ ...qtmulti, valeur: 10, affichage: "x10" })
    }
    if (qtmulti.valeur == 10) {
      setqtmulti({ ...qtmulti, valeur: 100, affichage: "x100" })
    }
    if (qtmulti.valeur == 100) {
      setqtmulti({ ...qtmulti, valeur: 0, affichage: "Max" })
    }
    if (qtmulti.valeur == 0) {
      setqtmulti({ ...qtmulti, valeur: 1, affichage: "x1" })
    }
  }

  const [showManagers, setShowManagers] = useState(false);
  const showManagersClick = () => {
    setShowManagers(!showManagers)
  }

  const [showunlock, setShowunlock] = useState(false);
  const showunlockClick = () => {
    setShowunlock(!showunlock)
  }

  const [showupgrade, setShowupgrade] = useState(false);
  const showupgradeClick = () => {
    setShowupgrade(!showupgrade)
  }

  function hireManager(manager: Pallier) {
    if (world.money >= manager.seuil) {
      world.money -= manager.seuil;
      manager.unlocked = true;
      world.products.product[manager.idcible - 1].managerUnlocked = true;
      setOpen(true);
      services.putManager(manager)
    }
  }

  function checkGlobalUpgrade() {
    let products = world.products.product;
    let qtmin = products[0].quantite;
    for (let i = 1; i < products.length; i++) {
      if (products[i].quantite < qtmin) {
        qtmin = products[i].quantite;
      }
    }
    for (let upgrade of world.allunlocks.pallier) {
      if (qtmin > upgrade.seuil && upgrade.unlocked == false) {
        if (upgrade.typeratio == "GAIN") {
          for (let prod of products) {
            prod.revenu = prod.revenu * upgrade.ratio;
          }
        }
        if (upgrade.typeratio == "VITESSE") {
          for (let prod of products) {
            prod.vitesse = prod.vitesse / upgrade.ratio;
            prod.timeleft = prod.timeleft / upgrade.ratio;
          }
        }
      }
    }
  }

    const close = () => { setOpen(false) }
    const onUserNameChanged = (evt: any) => {
      setUsername(evt.target.value);
    }

    const buyUpgrade = (upgrade: Pallier) => {
      if (upgrade.typeratio == 'GAIN') {
        world.products.product[upgrade.idcible - 1].revenu *= upgrade.ratio;
      }
      if (upgrade.typeratio == 'VITESSE') {

      }
    }



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
            <span dangerouslySetInnerHTML={{ __html: transform(world.money) }} />
          </div>
        </div>
        <div className="main">
          <div className='sideBar'>
            <div> <input type="text" value={username} onChange={onUserNameChanged} /></div>
            <div className='buttons'>
              <div className='button' onClick={showunlockClick} >Unlocks</div>
              <div className='button' onClick={showupgradeClick} >Cash Upgrades</div>
              <div className='button'>Angel Upgrades</div>
              <div className='button' onClick={showManagersClick} >Managers</div>
              <div className='button'>Investors</div>
            </div>
          </div>
          <div className="product">
            <div className="products">
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                  {world.products.product.map(prod =>
                    <Grid item xs={4}>
                      <ProductComponent onProductionDone={onProductionDone} prod={prod} services={services} multi={qtmulti.affichage} multiValue={qtmulti.valeur} money={world.money} onProductBuy={onProductBuy} />
                    </Grid>
                  )}
                </Grid>
              </Box>
            </div>
            {showManagers &&
              <div className="modal">
                <div>
                  <div className='croixM' onClick={showManagersClick}></div>
                  <h1 className="title">Managers make you feel better !</h1>
                </div>
                <div className='container'>
                  {world.managers.pallier.filter(manager => !manager.unlocked).map(manager =>
                    <div key={manager.idcible} className="managergrid">
                      <div>
                        <div className="logo">
                          <img alt="manager logo" className="round" src={
                            services.server + manager.logo} />
                        </div>
                      </div>
                      <div className="infosmanager">
                        <div className="managername"> {manager.name} </div>
                        <div className="managercible"> {
                          world.products.product[manager.idcible - 1].name} </div>
                        <div className="managercost"> {manager.seuil} </div>
                      </div>
                      <div onClick={() => hireManager(manager)}>
                        <button disabled={world.money < manager.seuil} >Hire !</button>
                      </div>
                      {open && <div className='popUp'>
                        <span>Vous avez engagé un nouveau Manager !</span>
                        <div onClick={close}></div>
                      </div>}
                    </div>)
                  } </div>

              </div>
            }
            {showunlock &&
              <div className="modal">
                <div>
                  <div className='croixM' onClick={showunlockClick}></div>
                  <h1 className="title">Unlocks</h1>
                </div>
                <div className='container'>
                  {world.products.product.map(prod => prod.palliers.pallier.filter(unlock => !unlock.unlocked).map(unlock =>
                    <div key={unlock.idcible} className="managergrid">
                      <div>
                        <div className="logo">
                          <img alt="manager logo" className="round" src={
                            services.server + unlock.logo} />
                        </div>
                      </div>
                      <div className="infosmanager">
                        <div className="managername"> {unlock.name} </div>
                        <div>{unlock.typeratio} x{unlock.ratio} </div>
                        <div className="managercible"> {
                          // world.products.product[unlock.idcible - 1].name
                        }
                        </div>
                        <div className="managercost"> {unlock.seuil} </div>
                      </div>
                    </div>))
                  }
                  {world.allunlocks.pallier.filter(unlock => !unlock.unlocked).map(unlock =>
                    <div key={unlock.idcible} className="managergrid">
                      <div>
                        <div className="logo">
                          <img alt="manager logo" className="round" src={
                            services.server + unlock.logo} />
                        </div>
                      </div>
                      <div className="infosmanager">
                        <div className="managername"> {unlock.name} </div>
                        <div>{unlock.typeratio} x{unlock.ratio} </div>
                        <div className="managercible"> {
                          // world.products.product[unlock.idcible - 1].name
                        }
                        </div>
                        <div className="managercost"> {unlock.seuil} </div>
                      </div>
                    </div>)
                  } </div>

              </div>
            }
            {showupgrade &&
              <div className="modal">
                <div>
                  <div className='croixM' onClick={showupgradeClick}></div>
                  <h1 className="title">Upgrade</h1>
                </div>
                <div className='container'>
                  {world.upgrades.pallier.filter(upgrade => !upgrade.unlocked).map(upgrade =>
                    <div key={upgrade.idcible} className="managergrid">
                      <div>
                        <div className="logo">
                          <img alt="manager logo" className="round" src={
                            services.server + upgrade.logo} />
                        </div>
                      </div>
                      <div className="infosmanager">
                        <div className="managername"> {upgrade.name} </div>
                        <div className="managercost"> {upgrade.seuil} </div>
                        <div>{upgrade.typeratio} x{upgrade.ratio} </div>
                        {/* <div className="managercible"> {
                          world.products.product[upgrade.idcible - 1].name} </div> */}
                      </div>
                      <div onClick={() => buyUpgrade(upgrade)}>
                        <button disabled={world.money < upgrade.seuil} >Acheter</button>
                      </div>
                    </div>)
                  } </div>

              </div>
            }
          </div>
        </div>
      </div>
    );
  }

  export default App;
