const express = require('express')
const hbs = require('hbs')
const path = require('path')

require('./db/mongoose')
const User = require('./models/users')

const app = express()

app.use(express.urlencoded({
    extended: false
}));

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../public/views')

app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.static(publicDirectoryPath))

app.get('/', (req, res)=>{
    res.render('index')
})  

app.get('/signup', (Req, res)=>{
    res.render('signup')
})


app.post('/signup', async (req, res)=>{
try{
    const user = new User(req.body)
    await user.save()
    const status_ = "User signed up successfully"
    res.redirect('/signup/'+ status_)


}catch(e){
    console.log(e)
    res.render('signup',
    {
        error: e.errors.password.properties.message
    }
    );
}
})

app.get('/signup/:status_', (req, res)=>{
    const status_ = req.params.status_
    res.render('signup', {
        status_
    })
    console.log(status_)
})

app.post('/verify', async (req, res)=>{
try{
    console.log(req.body)
const user = await User.findOne({email: req.body.email})
if(user.password = req.body.password){
    res.render('bio',{
        userData: user
    })
}
}catch(e){
    console.log(e)
    res.render('index')
}
})


app.get('/save_notes/:id', async(req, res)=>{
    const id = req.params.id
    const user = await User.findOne({_id: id})
    return res.render('bio',{
        userData: user
    })


})


app.post('/save_notes/:id', async (req, res)=>{
    try{
        const id = req.params.id
        console.log(id)
        const user = await User.findOne({_id: id})
        const note = req.body.new_note
        console.log(note)
        user.notes = user.notes.concat(note)
        await user.save()
        return res.redirect('/save_notes/'+id)
    
    }
    catch(e){
        console.log(e)
        res.send('Site under maintenance')
    }

})

app.post('/delete_notes/:id', async(req, res)=>{
    const id = req.params.id
    try{
        const user = await User.findOne({_id:id})
        console.log(user)
        console.log(req.body.note_name)
        const notes = user.notes.filter((note)=>{
            return note!=req.body.note_name
        })
        user.notes = notes
        await user.save()
        console.log(notes)
        return res.redirect('/save_notes/'+id)
    
    }
    catch(e){
        console.log(e)
        res.send('Site under maintenance')
    }
})

app.post('/edit_notes/:id', async(req, res)=>{
    const id = req.params.id

    res.render('edit_note',{
        id : id,
        note: req.body.note_name
    })

})

app.post('/save_edited_note/:id', async (req,res)=>{

    const id = req.params.id
    const user = await User.findOne({_id: id})
    console.log(req.body.old_note)
    console.log(req.body.new_note)
    var notes = user.notes.filter((note)=>{
        return note!=req.body.old_note
    })
    notes = notes.concat(req.body.new_note)
    user.notes = notes
    await user.save()

    return res.redirect('/save_notes/'+id)

})

app.listen(3000, ()=>{
    console.log('Server is up')
})

