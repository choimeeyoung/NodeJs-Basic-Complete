let express = require('express');
let app = express();
let bodyParser = require('body-parser')
let fs = require('fs')

app.use(bodyParser.urlencoded({extended:false}))

app.set('view engine','jade');
app.set('views','./views');

app.locals.pretty = true;

// 01. 입력폼 화면으로 이동
app.get('/topic/form',function (req,res){
    res.render('form')
})

// 02. 입력값 파일로 저장 , 저장 성공시 해당 게시물 페이지 이동
app.post('/topic/submit',function(req,res){
    let title = req.body.title;
    let description = req.body.description;
    fs.writeFile('data/'+title,description,function(err){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error')
        }
        res.redirect('/topic/'+title)
    })
})


// 03/04
app.get(['/topic','/topic/:title'],function(req,res){
    fs.readdir('data',function(err,files) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error')
        }

        let title = req.params.title
        if (title){
            fs.readFile('data/'+title,function(err,data){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error')
                }

                res.render('main',{titles:files,title:title,description:data})
            })
        }else{
            res.render('main',{titles:files})
        }
    })
})


// 03. 메인화면에 목록 보여주기
// app.get('/topic',function(req,res){
//     fs.readdir('data',function(err,files){
//         if(err){
//             console.log(err);
//             res.status(500).send('Internal Server Error')
//         }
//         res.render('main',{titles:files})
//     })
// })

// 04. 해당 타이틀의 페이지 보여주기
// app.get('/topic/:title',function(req,res){
//     fs.readdir('data',function(err,files){
//         if(err){
//             console.log(err);
//             res.status(500).send('Internal Server Error')
//         }
//
//         let title = req.params.title
//         fs.readFile('data/'+title,function(err,data){
//             if(err){
//                 console.log(err);
//                 res.status(500).send('Internal Server Error')
//             }
//
//             res.render('main',{titles:files,title:title,description:data})
//         })
//     })
// })

app.listen(3000,function(){
    console.log("Connected 3000 Port !!")
})