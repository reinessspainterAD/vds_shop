import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import LXCConsole from './LXCConsole.jsx'
function Server() {
    // const { vmid } = useParams()

    return (
        <div> <LXCConsole vmid='1006'/> </div>
    );
}

export default Server;
