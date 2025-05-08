import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const LXCConsole = ({ vmid }) => {
    const terminalRef = useRef(null)
    const term = useRef(null)

    useEffect(() => {
        term.current = new Terminal({ cursorBlink: true, fontSize: 14 });
        const fitAddon = new FitAddon();
        term.current.loadAddon(fitAddon);
        if (terminalRef.current) {
            term.current.open(terminalRef.current);
            fitAddon.fit();
        }
        fitAddon.fit();

        // Подключение к backend WebSocket
        const socket = new WebSocket(`wss://localhost:1337/api/lxc/console/${vmid}`);

        socket.onopen = () => {
            term.current.write('\x1b[32mПодключение установлено...\r\n');
        };

        socket.onmessage = (event) => {
            term.current.write(event.data);
        };

        socket.onerror = (err) => {
            console.error('WebSocket error:', err);
        };

        socket.onclose = () => {
            term.current.write('\r\n\x1b[31mСоединение закрыто.\x1b[0m');
        };

        term.current.onData((data) => {
            socket.send(data);
        });

        return () => {
            term.current.dispose();
            socket.close();
        };
    }, [vmid])

    return(
        <div
            ref={terminalRef}
            style={{ width: '100%', height: '500px', backgroundColor: 'gray' }}
        />
    )
}

export default LXCConsole