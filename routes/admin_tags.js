var express = require('express');
var Tag = require('./../models/tags');
var router = express.Router();
/* Get Tags */
router.get('/',function(req,res){
  Tag.find({},(err,tags)=>{
    res.render('admin/tags',{
      title:'Tags',
      tags:tags
    });
  })
})
/* GET add-tag */
router.get('/add-tag',function(req,res){
  res.render('admin/add_tag',{
    title:'Add Tag'
  });
});
/* POST add-tag */
router.post('/add-tag',function(req,res){
  req.checkBody('tag','tag must have a value').notEmpty();
  var errors =req.validationErrors();
  if(errors){
  res.render('/admin/add-tag',{
    title:'Add Tag',
    errors:errors
  });
  }else{
  Tag.findOne({tag:req.body.tag},function(err,tag){
    if(tag){
      req.flash('danger','Tag exits, choose another');
      res.render('admin/add_tag',{
        title:'Add Tag'
      });
    }else{
      var tag=new Tag({
        tag:req.body.tag
      });
      tag.save(function(err){
        if(err) return console.log("errorr");
        req.flash('success','Tag added!.');
        res.redirect('/admin/tags/add-tag');
      });
    }
  });
}
});
/* GET edit-tag */
router.get('/edit-tag/:id',function(req,res){
  Tag.findById(req.params.id,function(err,tag){
    res.render('admin/edit_tag',{
      title:'Edit Tag',
      tag:tag
    })
  })
})
/* POST edit-tag */
router.post('/edit-tag/:id',function(req,res){
  console.log('trung');
  console.log(req.body.tag);
  Tag.findOne({tag:req.body.tag,_id:{'$ne':req.params.id}},function(err,tag){
    if(tag){
      req.flash('danger','Tag exits, choose another ')
      res.render('admin/edit_tag',{
        title:'Edit Tag',
        tag:tag
      });
    }else{
      console.log('sua')  
      Tag.findById(req.params.id,function(err,tag){
        tag.tag=req.body.tag;
        tag.save(function(err){
          if(err) return console.log(err);
          req.flash('success',"Tag edited!.");
          res.redirect('/admin/tags/edit-tag/'+req.params.id);
        });
      });
  }});
});
/* GET delete-tag */
router.get('/delete-tag/:id',function(req,res){
  Tag.findByIdAndRemove(req.params.id,function(err){
    if(err) console.log(err);
    req.flash('success',"Tag deleted!.");
    res.redirect('/admin/tags');
  })
})
module.exports = router;
