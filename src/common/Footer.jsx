import React, { useContext, useState, useRef } from "react";
import { ProductContext } from "../pages/Landing";
import { Box, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Footer = () => {
    const [query, setQuery] = useState("")
    const { message, setMessage } = useContext(ProductContext)
    const data = { query }
    const clickButtonRef = useRef(null);

    const handleSendMessage = async () => {
        if (query.trim() !== "") {
            setMessage(message => [
                ...message,
                {
                    user: "User",
                    text: query
                },
                {
                    user: "Bot",
                    text: "Loading..."
                }
            ])
            try {
                const res = await fetch('http://localhost:8000/chat', {
                    method: "POST",
                    body: JSON.stringify(data)
                })
        
                if (res.ok) {
                    setQuery("")
                    const response = await res.json()
                    setMessage(message => [
                        ...message.filter(
                            (item) => item.text !== "Loading..."
                        ),
                        {
                            user: "BOT",
                            text: response.message
                        }
                    ])
                }
            }
            catch(error) {
                setQuery("")
                setMessage(message => [
                    ...message.filter(
                        (item) => item.text !== "Loading..."
                    ),
                    {
                        user: "BOT",
                        text: error.message + ". Please ask again in more detail."
                    }
                ])
            }
            setMessage(
                (message) => message.filter(
                    (item) => item.text !== "LOADING"
                )
            )
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            clickButtonRef.current.click();
        }
    };

    return (
        <div className="footer-container">
            <TextField
                value={ query }
                className="form-control"
                type="text"
                onKeyDown={ handleKeyDown }
                onChange={ (e) => setQuery(e.target.value) }
                placeholder="Ask any question about your purpose: "
                multiline
                fullWidth
                maxRows={5}
            />
            <Button variant="contained" size="large" endIcon={<SendIcon />} onClick={ handleSendMessage } ref={ clickButtonRef }>
                ASK
            </Button>
        </div>
    )
}

export default Footer;