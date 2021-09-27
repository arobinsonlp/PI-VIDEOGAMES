// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
var axios = require('axios');
const e = require('express');
const { Router } = require('express');
var express = require('express');
//const { where } = require('sequelize/types');
require('dotenv').config();
const {APIKEY}=process.env
const {Videogame,Genre} = require('../db.js')

const router = Router();
const url=`https://api.rawg.io/api/`
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

// GET/videogames    // GET videogames?name=
// me traigo la info de la api 
const getfiltroAPI= async (req,res)=>{ // debe esperar a que se carge toda la info antes de renderizar algo
    let genres=[] 
        let response=await axios.get(`${url}genres?key=${APIKEY}`) // await
        response.data.results.map(element => { // capturo la rspuesta xq es asincrono
            genres.push( 
                {name:element.name,
                games: element.games.map(el=>{
            return {
                id:el.id,
                name:el.name,
                background_image:el.background_image,
                genres:el.genres
            }

                }  )
                })
                
        })
 return genres
}

const getFiltroDB= async ()=>{
    return await Genre.findAll({
        attributes:['name'] ,
        
        
        include:{
            model:Videogame,
            attributes:['name','id','background_image'],
            through: {
                attributes: []
            }
        } })
        
 };
 const getAllfiltro= async(req,res)=>{
    const db= await getFiltroDB();
    let genres=[]
   let nuevo = await db.map(element => { // capturo la rspuesta xq es asincrono
        genres.push( 
            {name:element.name,
            games: element.videogames.map(el=> el.name )
            })
            
    })
    return genres
 }

 const finalFiltro =async (req,res)=>{
    const gamesApifiltro= await getAllfiltro();
        const gamesDBfiltro= await getfiltroAPI();
        
        
const aux=[...gamesDBfiltro,
    ...gamesApifiltro]
 
res.send(aux)
       
 }

 

    module.exports={finalFiltro}


