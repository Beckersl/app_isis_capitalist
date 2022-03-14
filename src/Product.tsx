import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Product } from './world';
import { Services } from './Services';
import ProgressBar from './ProgressBar';
import Box from '@mui/material/Box';


let inProd:boolean;

type ProductProps = {
    prod: Product
    onProductionDone: (prod: Product) => void
    onProductBuy: (qt: number, product: Product) => void
    services: Services
    multi: string
    multiValue: number
    money: number
}


export default function ProductComponent({ prod, onProductionDone, services, multi, multiValue, money, onProductBuy }: ProductProps) {
    const [achatPossible, setAchatPossible] = useState(0);
    const [afficheAchat, setAfficheAchat] = useState(10);
    const [quantite, setQuantite] = useState(prod.quantite);

    useEffect(() => {
        calcMaxCanBuy()
       }, [multiValue])

    useEffect(() => {
        calcMaxCanBuy()
       }, [money])

    function calcScore() {
        if(prod.managerUnlocked == true && inProd == false) {startFabrication()}
        if (prod.timeleft > 0) {
            prod.timeleft = prod.timeleft - (Date.now() - prod.lastupdate) ;
            setProgress(((prod.vitesse - prod.timeleft) / prod.vitesse) * 100) ;
            if (prod.timeleft == 0) {prod.timeleft-=1}
        }
        if (prod.timeleft < 0 && inProd==true) {
            prod.timeleft = 0;
            setProgress(0);
            inProd = false;
            onProductionDone(prod);
        }
    }

    const [progress, setProgress] = useState(0)
    const savedCallback = useRef(calcScore)
    useEffect(() => savedCallback.current = calcScore)
    useEffect(() => {
        let timer = setInterval(() => savedCallback.current(), 100)
        return function cleanup() {
            if (timer) clearInterval(timer)
        }
    }, [])

    function startFabrication() {
        prod.timeleft = prod.vitesse;
        prod.lastupdate = Date.now();
        inProd=true;
        services.putProduct(prod)
    }

    const calcMaxCanBuy = () => {
        setAchatPossible(Math.floor(Math.log(1- (money*(1-prod.croissance))/prod.cout)/Math.log(prod.croissance)))
        if (multiValue == 0) {
            setAfficheAchat(achatPossible)
        }
        if (multiValue > 0) {
            setAfficheAchat(multiValue)
        }
    }
    
    
    

    const achatFunc = () => {
        console.log("achat" + afficheAchat)
        onProductBuy(afficheAchat, prod)
        prod.quantite += afficheAchat
        setQuantite(prod.quantite)
        console.log(prod.quantite)
        services.putProduct(prod)
        testUnlockAvailable()
    }

    function testUnlockAvailable() {
        for(let pallier of prod.palliers.pallier){
            if(prod.quantite>=pallier.seuil && pallier.unlocked==false){
                pallier.unlocked = true;
                if (pallier.typeratio == "GAIN") {
                    prod.revenu = prod.revenu * pallier.ratio;
                }
                if (pallier.typeratio == "VITESSE") {
                    prod.vitesse = prod.vitesse / pallier.ratio;
                    prod.timeleft = prod.timeleft / pallier.ratio
                }
                if (pallier.typeratio == "ANGE") {
                    
                }
            }
        }
        
        return true;
    }

    return (
        <div className="productBox" >
            <img src={services.server + prod.logo} onClick={startFabrication}/>
            <Box sx={{ width: '100%' }}>
                <ProgressBar transitionDuration={"0.1s"} customLabel={" "} completed={progress} />
                <div>{prod.cout} {money} {achatPossible} quantité : {quantite}</div>
                <div onClick={achatFunc}>
                    <button className='boutonAchat' disabled={achatPossible < multiValue} >Achat x{afficheAchat}</button>
                </div>
            </Box>
        </div>
    )
}
