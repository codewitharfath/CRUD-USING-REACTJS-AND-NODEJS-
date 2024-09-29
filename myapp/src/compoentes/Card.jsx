import React from 'react'
import { useState } from 'react'
import axios from "axios"
import { useEffect } from 'react'

const Card = () => {
    const [users,setusers] = useState([])
    const [filteruser,setfilteruser] = useState([])
    const [isModelopen,setisModelopen] = useState(true)
    const [userData,setuserData] = useState({
        name:"",age:"",city:""
    })

    const getAllUsers = async ()=>{
        await axios.get("http://127.0.0.1:8000/users").then((res)=>{
          
            setusers(res.data)
            setfilteruser(res.data)
        })
    }

    useEffect(()=>{
        getAllUsers()
    },[])

    const handlesearch = (e)=>{
        const searchtext = e.target.value.toLowerCase();
        const filterUser = users.filter((user)=>user.name.toLowerCase().includes(searchtext) || user.city.toLowerCase().includes(searchtext) )
        setfilteruser(filterUser)

    }

    const handledelete = async (id)=>{
        await axios.delete(`http://127.0.0.1:8000/users/${id}`).then((res)=>{
            setusers(res.data)
            setfilteruser(res.data)
        })

    }
    const closemodel = ()=>{
        setisModelopen(false)
        getAllUsers()
    }
    const handleaddrecord = ()=>{
        setuserData({name:"",age:"",city:""})
        setisModelopen(true)
    }
    const handlechange = (e)=>{
        setuserData({...userData,[e.target.name]:e.target.value})
    }
    const submitform = async (e)=>{
        e.preventDefault()
        if(userData.id){
            await axios.patch(`http://127.0.0.1:8000/users/${userData.id}`,userData).then((res)=>{
                console.log(res)
            })

        }else{

            await axios.post("http://127.0.0.1:8000/users/",userData).then((res)=>{
                console.log(res)
            })
        }
        closemodel();
        setuserData({name:"",age:"",city:""})

    }

    //update user function
    const handleupdateRecord = (user)=>{
        setuserData(user)
        setisModelopen(true)

    }
  return (
   <>
   <div className="container">
    <h3>Crud Application with React.js Frontend and Node</h3>
    <div className="input-search">
        <input type="text" placeholder='search Text here' onChange={handlesearch} />
        <button onClick={handleaddrecord} className='btn green'>Add Record</button>
    </div>
    <table className='table'>
        <thead>
            <tr>
                <th>SNO</th>
                <th>Name</th>
                <th>Age</th>
                <th>City</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
     {filteruser && 
      filteruser.map((user,index)=>{
        return  <tr key={user.id}>
        <td>{index +1}</td>
        <td>{user.name}</td>
        <td>{user.age}</td>
        <td>{user.city}</td>
        <td>
            <button onClick={()=> handleupdateRecord(user)} className='btn green'>Edit</button>
        </td>
        <td><button onClick={()=> handledelete(user.id)} className='btn red' >Delete</button></td>
    </tr>
      }) 
      
}
        </tbody>
    </table>
 { isModelopen &&    <div className="model">
        <div className="model-content">
            <span onClick={closemodel} className="close">&times;</span>
            <h1>{userData ? "update Record":"Add Record"}</h1>
            <div className="input-group">
                <label htmlFor="name">full Name:</label>
                <input type="text" name='name' onChange={handlechange} value={userData.name} id='name' />
            </div>
            <div className="input-group">
                <label htmlFor="age">Age:</label>
                <input name='age' onChange={handlechange} value={userData.age} type="text" id='age' />
            </div>
            <div className="input-group">
                <label htmlFor="city">city:</label>
                <input name='city' onChange={handlechange} type="text" value={userData.city} id='city' />
            </div>
            <div>
                <button onClick={submitform} className='btn green'>{userData.id ? "update User":"Add User"}</button>
            </div>
            
        </div>
    </div>
    }
   </div>

   </>
  )
}

export default Card