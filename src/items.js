/* 
Tasks :
1. Create Register section
   For register show inputs for email/username/password/firstname/lastname. 
   on click return success or error.
2. Login secition :
   Allow typing in username and password and login with these credintials.
   Save username to local storage and show "Hello {username} for then given logged in user."
3. Create item section :
    Create an input to provide name for the new item.
4. Support Delete. (https://abra-course-server.herokuapp.com/items/<id>/ with DELETE method)
5. Support rename (https://abra-course-server.herokuapp.com/items/<id>/ with PATCH method and
   { name : <name>})
6. Logout. should erase local storage.
7. BONUS : learn about AXIOS, try to change fetch to axios.
*/

/* 
1) register section - show on init only if local storage is empty ( user not logged in or does not exist)
Create new component for form

2) login section - show on init only if local storage is empty.  Do a "create user or log in" type situation

3) self explanatory.  Shoud display after login successful

4) support delete

5) support rename

6) logout to flush local storage
*/

import { useState, useEffect } from 'react';

const SERVER_URL = "https://abra-course-server.herokuapp.com/";

const Items = (props) => {

    const [accessToken, setAccessToken] = useState(undefined);
    const [items, setItems] = useState(undefined);

    //console.log(items);

    const getItems = async() => {
        const response = await fetch(SERVER_URL + "items/",
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            method: "GET"
        })

        if (response.status === 200) {
            const data = await response.json();
            setItems(data);
        }

    }

    useEffect( () => {
        const token = localStorage.getItem("Token");
        setAccessToken(token);

    }, []);

    useEffect( () => {

        if (accessToken) {
            getItems();
        }

    }, [accessToken]);

    const login = async (username, password) => {
        
        const payload = {
            username,
            password
        }

        const response = await fetch(SERVER_URL + "api/token/",
        {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(payload)
        })

        const data = await response.json()

        return data.access;
    }

    const register = async (username, password, email, firstName, lastName) =>
    {
        const payload = {
            username: username,
            password: password,
            password2: password,
            email: email,
            first_name: firstName,
            last_name: lastName 
        };

        try {

            const response = await fetch(SERVER_URL + "register/",
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(payload)
            })

            const data = await response.json();
           // console.log(data);
        } catch(err) {
            console.log(err);
        }
        
    }


    const createItem = async ( name ) => {

        const payload = {
            name
        };
       // console.log(JSON.stringify(payload));
        const response = await fetch(SERVER_URL + "items/",
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            method: "POST",
            body: JSON.stringify(payload)
        })

        const data = await response.json();

        getItems();

    }
    const loginUser = async () => {
        const accessToken = await login("Hagai_Leshem","!q1W2e3r4");
        setAccessToken(accessToken);
        localStorage.setItem("Token", accessToken);
        console.log(accessToken);
    }


    // <button onClick={() => register("test3","@Q1w2e3r4","te3st@gmail.com","E","Z")}>Register</button>
    // <button onClick={loginUser}>Login Test</button>
    return (
        <>
        {localStorage.getItem("Token") ? `<div> welcome </div>` : `<button>register</button> or <button>Log-in</button> `}
        
        <button onClick={() => localStorage.clear()}>logout</button>
        {accessToken && <button onClick={getItems}>get Items</button> }
        {accessToken && <button onClick={() => createItem("My new item")}>Create item</button> }
        { accessToken && <p>Your acccess token : {accessToken}</p>}
        { items && 
            <>
                <ul>
                    {items.map(item => {
                        return <li key={item.id}>{item.id}</li>
                    })} 
                </ul>
            </>}
        </>
    )
}

export default Items;