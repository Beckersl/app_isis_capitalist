
import { World } from "./world"
import { Services } from "./Services"
import { useState } from "react"


type ManagerProps = {
    world: World
    services: Services
    showManagers: Boolean
}

export default function Manager({ world, services, showManagers }: ManagerProps) {



    return (

        <div> {showManagers &&
            <div className="modal">
                <div>
                    <h1 className="title">Managers make you feel better !</h1>
                </div>
                <div>
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
                            <div /*onClick={() => hireManager(manager)}*/>
                                <button disabled={world.money < manager.seuil}>Hire !</button>
                            </div>
                        </div>)
                    } </div>
            </div>
        }</div>
    )
}

