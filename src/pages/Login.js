import React, {useEffect} from 'react'
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import auth from 'solid-auth-client'
import {useHistory} from "react-router";


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 250,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function Login()  {

    const history = useHistory();
    const [loggedIn, setLoggedIn] = React.useState('')

    useEffect(() => {
        auth.trackSession(session => {
            setLoggedIn(!!session);
            if(session){
                history.push("/home");
            }
        })
    }, [])

    const classes = useStyles();
    const [provider, setProvider] = React.useState('');

    const handleChange = (event) => {
        setProvider(event.target.value);
    };

    const handleLogin = (event) => {
        if(provider){
            auth.login(provider)
        }
        console.log('login', provider)
    }

    const logout = (event) => {
        auth.logout();
        /*setTimeout(function () {
            location.reload()
        }, 1500)  */
    }

    return (<div>

                {
                    loggedIn ? (
                        <button onClick={logout}>Log out</button>
                    ) : (
                        <div>

                            <FormControl className={classes.formControl}>
                                <InputLabel id="demo-simple-select-label">Seleccione una opción</InputLabel>
                                <Select value={provider} onChange={handleChange}>
                                    <MenuItem value='https://solid.community/'>Solid Community Provider</MenuItem>
                                    <MenuItem value='https://inrupt.net/'>SOLID Inrupt Provider</MenuItem>
                                    <MenuItem value='https://localhost:8443'>SOLID Local Provider</MenuItem>
                                </Select>

                            </FormControl>


                            <input type="button" className="fadeIn fourth" value="Entrar" onClick={handleLogin} />
                        </div>
                    )
                }


        </div>
    )
}


