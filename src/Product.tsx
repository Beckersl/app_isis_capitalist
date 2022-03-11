import React from 'react';
import {Product} from './world';
import {Services} from './Services'

type ProductProps = {
    prod: Product
    services: Services
   }
   export default function ProductComponent({ prod, services } : ProductProps)
   {
   return (
    <div className="productBox"> 
        <img src={services.server + prod.logo}/>
    </div>
   )
   }
   