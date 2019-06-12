var express = require('express');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var router = express.Router();
var Champion = require('../models/champions');
var Tag = require('../models/tags');
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;
var isUser=auth.isUser;

/* GET / */
router.get('/',function (req, res) {
  Champion.find({}, function (err, champions) {
    res.render('admin/champions', {
      title: 'Champions',
      champions: champions
    })
  })
})
/* GET add-champion */
router.get('/add-champion',function (req, res) {
  Tag.find({}, function (err, tags) {
    if (err) console.log(err)
    res.render('admin/add_champion', {
      title: 'Add Champion',
      tags: tags
    });
  });
});
/* POST add-champion */
router.post('/add-champion', function (req, res) {
  var image, image0, image1, image2, image3, image4;
  var missImage;
  if (req.files && Object.values(req.files).length == 6) {
    var image = req.files !== null ? req.files.image.name : '';
    var image0 = req.files !== null ? req.files.image0.name : '';
    var image1 = req.files !== null ? req.files.image1.name : '';
    var image2 = req.files !== null ? req.files.image2.name : '';
    var image3 = req.files !== null ? req.files.image3.name : '';
    var image4 = req.files !== null ? req.files.image4.name : '';
    var missImage = null;
  } else {
    var image = '';
    var image0 = '';
    var image1 = '';
    var image2 = '';
    var image3 = '';
    var image4 = '';
    var missImage = 1;
  }
  req.checkBody('name', 'Name must have a value').notEmpty();
  req.checkBody('title', 'Title must have a value').notEmpty();
  req.checkBody('passive', 'Passive must have a value').notEmpty();
  req.checkBody('skill1', 'Skill 1 must have a value').notEmpty();
  req.checkBody('skill2', 'Skill 2 must have a value').notEmpty();
  req.checkBody('skill3', 'Skill 3 have a value').notEmpty();
  req.checkBody('skill4', 'Skill 4 must have a value').notEmpty();
  req.checkBody('desc', 'Dedescription must have a value').notEmpty();
  req.checkBody('descp', 'Dedescription Passive must have a value').notEmpty();
  req.checkBody('desc1', 'Dedescription Skill 1 must have a value').notEmpty();
  req.checkBody('desc2', 'Dedescription Skill 2 must have a value').notEmpty();
  req.checkBody('desc3', 'Dedescription Skill 3 must have a value').notEmpty();
  req.checkBody('desc4', 'Dedescription Skill 4 must have a value').notEmpty();
  req.checkBody('image', 'You have must upload a  image Champion').isImage(image);
  req.checkBody('image0', 'You have must upload a image Passive').isImage(image0);
  req.checkBody('image1', 'You have must upload a image Skill 1').isImage(image1);
  req.checkBody('image2', 'You have must upload a image Skill 2').isImage(image2);
  req.checkBody('image3', 'You have must upload a image Skill 3').isImage(image3);
  req.checkBody('image4', 'You have must upload a image Skill 4').isImage(image4);
  var errors = req.validationErrors();
  if (errors && missImage) {
    req.flash('danger', 'You have must upload 6 image!.');
    Tag.find({}, function (err, tags) {
      if (err) console.log(err)
      res.render('admin/add_champion', {
        title: 'Add Champion',
        errors: errors,
        tags: tags
      });
    });
  } else {
    Champion.findOne({ name: req.body.name }, function (err, champion) {
      if (champion) {
        req.flash('danger', 'Champion exits please choose another!.');
        Tag.find({}, function (err, tags) {
          if (err) console.log(err)
          res.render('admin/add_champion', {
            title: 'Add Champion',
            tags: tags
          });
        })
      } else {
        var champion = new Champion({
          name: req.body.name,
          title: req.body.title,
          img: req.files.image.name,
          desc: req.body.desc,
          tags: req.body.tags,
          passive: {
            img: image0,
            title: req.body.passive,
            desc: req.body.descp,
          },
          skill1: {
            img: image1,
            title: req.body.skill1,
            desc: req.body.desc1,
          },
          skill2: {
            img: image1,
            title: req.body.skill2,
            desc: req.body.desc2,
          },
          skill3: {
            img: image3,
            title: req.body.skill3,
            desc: req.body.desc3,
          },
          skill4: {
            img: image4,
            title: req.body.skill4,
            desc: req.body.desc4,
          },
        });
        champion.save(function (err) {
          if (err) console.log(err);
          mkdirp('public/champion_images/' + champion._id, function (err) {
            if (err) console(err);
          });
          mkdirp('public/champion_images/' + champion._id + '/skin_images', function (err) {
            if (err) console.log(err);
          });
          req.files.image.mv('public/champion_images/' + champion._id + '/' + req.files.image.name, function (err) {
            if (err) console.log(err);
          });
          req.files.image0.mv('public/champion_images/' + champion._id + '/' + req.files.image0.name, function (err) {
            if (err) console.log(err);
          });
          req.files.image1.mv('public/champion_images/' + champion._id + '/' + req.files.image1.name, function (err) {
            if (err) console.log(err);
          });
          req.files.image2.mv('public/champion_images/' + champion._id + '/' + req.files.image2.name, function (err) {
            if (err) console.log(err);
          });
          req.files.image3.mv('public/champion_images/' + champion._id + '/' + req.files.image3.name, function (err) {
            if (err) console.log(err);
          });
          req.files.image4.mv('public/champion_images/' + champion._id + '/' + req.files.image4.name, function (err) {
            if (err) console.log(err);
          });
          req.flash('success', 'Champion added!.');
          res.redirect('/admin/champions/add-champion')
        })
      }
    })
  }
});
/* GET edit-champion */
router.get('/edit-champion',isAdmin,(req, res) => {
  Champion.findById(req.query.id, (err, champion) => {
    if (err) console.log(err);
    Tag.find({}, function (err, tags) {
      if (err) console.log(err)
      res.render('admin/edit_champion', {
        title: 'Edit Champion',
        tags: tags,
        champion: champion
      });
    });
  })
})
/* POST edit-champion */
router.post('/edit-champion/:name', (req, res) => {
  var image, image0, image1, image2, image3, image4;
  if (req.files) {
    var image = req.files.image ? req.files.image.name : '';
    var image0 = req.files.image0 ? req.files.image0.name : '';
    var image1 = req.files.image1 ? req.files.image1.name : '';
    var image2 = req.files.image2 ? req.files.image2.name : '';
    var image3 = req.files.image3 ? req.files.image3.name : '';
    var image4 = req.files.image4 ? req.files.image4.name : '';
  } else {
    image = '';
    image0 = '';
    image1 = '';
    image2 = '';
    image3 = '';
    image4 = '';
  }
  console.log(image3);
  console.log(image4);
  req.checkBody('name', 'Name must have a value').notEmpty();
  req.checkBody('title', 'Title must have a value').notEmpty();
  req.checkBody('passive', 'Passive must have a value').notEmpty();
  req.checkBody('skill1', 'Skill 1 must have a value').notEmpty();
  req.checkBody('skill2', 'Skill 2 must have a value').notEmpty();
  req.checkBody('skill3', 'Skill 3 have a value').notEmpty();
  req.checkBody('skill4', 'Skill 4 must have a value').notEmpty();
  req.checkBody('desc', 'Dedescription must have a value').notEmpty();
  req.checkBody('descp', 'Dedescription Passive must have a value').notEmpty();
  req.checkBody('desc1', 'Dedescription Skill 1 must have a value').notEmpty();
  req.checkBody('desc2', 'Dedescription Skill 2 must have a value').notEmpty();
  req.checkBody('desc3', 'Dedescription Skill 3 must have a value').notEmpty();
  req.checkBody('desc4', 'Dedescription Skill 4 must have a value').notEmpty();
  if (image != '') {
    req.checkBody('image', 'You have must upload a  image Champion').isImage(image);
  }
  if (image0 != '') {
    req.checkBody('image0', 'You have must upload a  image 0 Champion').isImage(image0);
  }
  if (image1 != '') {
    req.checkBody('image1', 'You have must upload a  image 1 Champion').isImage(image1);
  }
  if (image2 != '') {
    req.checkBody('image2', 'You have must upload a  image 2 Champion').isImage(image2);
  }
  if (image3 != '') {
    req.checkBody('image3', 'You have must upload a  image 3 Champion').isImage(image3);
  }
  if (image4 != '') {
    req.checkBody('image4', 'You have must upload a  image 4 Champion').isImage(image4);
  }
  var errors = req.validationErrors();
  if (errors) {
    Champion.findOne({ name: req.params.name }, function (err, champion) {
      Tag.find({}, function (err, tags) {
        if (err) console.log(err)
        res.render('admin/edit_champion', {
          title: 'Add Champion',
          errors: errors,
          tags: tags,
          champion: champion
        });
      });
    })
  }
  else {
    Champion.findOne({ name: req.body.name, _id: { '$ne': req.query.id } }, (err, champion) => {
      if (champion) {
        console.log(req.body.name);
        req.flash('danger', 'Name exits, choose another!.');
        Champion.findById(req.query.id, function (err, c) {
          Tag.find({}, function (err, tags) {
            if (err) console.log(err)
            res.render('admin/edit_champion', {
              title: 'Add Champion',
              errors: errors,
              champion: c,
              tags: tags
            });
          });
        })
      } else {
        Champion.findById(req.query.id, (err, champion) => {
          if (err) console.log(err)
          champion.name = req.body.name;
          champion.title = req.body.title;
          if (image !== '') {
            champion.img = req.files.image.name;
          };
          champion.desc = req.body.desc;
          champion.tags = req.body.tags;
          champion.passive.title = req.body.passive;
          champion.passive.desc = req.body.descp;
          if (image0 !== '') {
            champion.passive.img = image0;
          };
          champion.skill1.title = req.body.skill1;
          champion.skill1.desc = req.body.desc1;
          if (image1 !== '') {
            champion.skill1.img = image1
          };
          champion.skill2.title = req.body.skill2;
          champion.skill2.desc = req.body.desc2;
          if (image2 !== '') {
            champion.skill2.img = image2
          };
          champion.skill3.title = req.body.skill3;
          champion.skill3.desc = req.body.desc3;
          if (image3 !== '') {
            champion.skill3.img = image3
          };
          champion.skill4.title = req.body.skill4;
          champion.skill4.desc = req.body.desc4;
          if (image4 !== '') {
            champion.skill4.img = image4
          };
          champion.save(function (err) {
            if (err) console.log(err);
            if (image !== '') {
              fs.remove('public/champion_images/' + req.query.id + '/' + req.body.pimage, function (err) {
                if (err) console.log(err);
                req.files.image.mv('public/champion_images/' + req.query.id + '/' + image, function (err) {
                  if (err) console.log(err)
                });
              });
            };
            if (image0 !== '') {
              fs.remove('public/champion_images/' + req.query.id + '/' + req.body.pimage0, function (err) {
                if (err) console.log(err);
                // console.log(req.body.pimage0);
                // console.log(req.body.image0);
                req.files.image0.mv('public/champion_images/' + req.query.id + '/' + image0, function (err) {
                  console.log(err);
                });
              });
            };
            if (image1 !== '') {
              fs.remove('public/champion_images/' + req.query.id + '/' + req.body.pimage1, function (err) {
                req.files.image1.mv('public/champion_images/' + req.query.id + '/' + image1, function (err) {
                  if (err) console.log(err)
                });
              });
            };
            if (image2 !== '') {
              fs.remove('public/champion_images/' + req.query.id + '/' + req.body.pimage2, function (err) {
                if (err) console.log(err);
                req.files.image2.mv('public/champion_images/' + req.query.id + '/' + image2, function (err) {
                  if (err) console.log(err)
                });
              });
            };
            if (image3 !== '') {
              fs.remove('public/champion_images/' + req.query.id + '/' + req.body.pimage3, function (err) {
                if (err) console.log(err);
                req.files.image3.mv('public/champion_images/' + req.query.id + '/' + image3, function (err) {
                  if (err) console.log(err)
                });
              });
            };
            if (image4 !== '') {
              fs.remove('public/champion_images/' + req.query.id + '/' + req.body.pimage4, function (err) {
                if (err) console.log(err);
                req.files.image4.mv('public/champion_images/' + req.query.id + '/' + image4, function (err) {
                  if (err) console.log(err)
                });
              });
            };
            req.flash('success', "Champion Edited!.");
            res.redirect('/admin/champions/edit-champion?id=' + champion._id);
          })
        })
      }
    });
    // fs.remove('public/champion_images/5cfcfddd3490eb169892fcea/'+req.body.pimage4,function(err){
    //   if(err) console.log(err);
    // })
    // req.files.image4.mv('public/champion_images/5cfcfddd3490eb169892fcea/'+req.files.image4.name,function(err){
    //   if(err) console.log(err);
    // })
  }
});
/* GET delete-champion */
router.get('/delete-champion', function (req, res) {
  Champion.findByIdAndRemove(req.query.id, function (err) {
    if (err) console.log(err);
    req.flash('success', 'Deleted Champion!');
    res.redirect('/admin/champions');
  })
})
module.exports = router;