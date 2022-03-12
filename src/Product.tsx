import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Product } from './world';
import { Services } from './Services';
import ProgressBar from './ProgressBar';
import Box from '@mui/material/Box';
import { MultiSelectUnstyled } from '@mui/base';

let inProd:boolean;

type ProductProps = {
    prod: Product
    onProductionDone: (prod: Product) => void
    services: Services
    multi: string
    multiValue: number
    money: number
}

const calcMaxCanBuy = () => {
    // 
}

export default function ProductComponent({ prod, onProductionDone, services, multi, multiValue, money }: ProductProps) {
    function calcScore() {
        console.log(inProd)
        if (prod.timeleft > 0) {
            console.log(prod.timeleft)
            prod.timeleft = prod.timeleft - (Date.now() - prod.lastupdate) ;
            setProgress(((prod.vitesse - prod.timeleft) / prod.vitesse) * 100) ;
            console.log("progress bar :" + progress);
            console.log(prod.timeleft);
        }
        if (prod.timeleft < 0 && inProd==true) {
            prod.timeleft = 0;
            setProgress(0);
            console.log("<0")
            inProd = false;
            onProductionDone(prod)
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
        console.log("click produit")
        prod.timeleft = prod.vitesse;
        prod.lastupdate = Date.now();
        inProd=true;
    }

    const [achatPossible, setAchatPossible] = useState(0);
    const achatFunc = () => {
        
        if (multiValue > 0) {
            
        }
    }
    return (
        <div className="productBox" >
            <img src={services.server + prod.logo} onClick={startFabrication}/>
            <Box sx={{ width: '100%' }}>
                <ProgressBar transitionDuration={"0.1s"} customLabel={" "} completed={progress} />
                <div>{prod.cout} {money} {achatPossible}</div>
                <div className='boutonAchat' onClick={achatFunc}>Achat {multi}</div>
                
            </Box>
        </div>
    )
}
