import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Product } from './world';
import { Services } from './Services';
import ProgressBar from './ProgressBar';
import Box from '@mui/material/Box';


type ProductProps = {
    prod: Product
    onProductionDone: (prod: Product) => void
    services: Services
}

let inProd = false;
export default function ProductComponent({ prod, onProductionDone, services }: ProductProps) {

    function calcScore() {
        if (prod.timeleft > 0) {
            prod.timeleft = prod.timeleft - (Date.now() - prod.lastupdate) ;
            prod.progressbarvalue = ((prod.vitesse - prod.timeleft) / prod.vitesse) * 100;
        }
        if (prod.timeleft <= 0 && inProd == true) {
            if (prod.timeleft < 0) {
                prod.timeleft = 0;
            }
            prod.progressbarvalue = 0;
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
        prod.timeleft = prod.vitesse;
        prod.lastupdate = Date.now();
        inProd=true;
    }
    return (
        <div className="productBox" onClick={startFabrication}>
            <img src={services.server + prod.logo} />
            <Box sx={{ width: '100%' }}>
                <ProgressBar transitionDuration={"0.1s"} customLabel={" "}
                    completed={progress} />
            </Box>
        </div>
    )
}
