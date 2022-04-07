const express = require('express');
const Skill = require('../objects/skill');

const skillRouter = express.Router();

skillRouter
    .route('/skills')
    .post(function (request, response) {

        console.log('POST /skills');

        var skill = new Skill(request.body);

        skill.save();

        response.status(201).send(skill);
    })
    .get(function (request, response) {

        console.log('GET /skills');

        Skill.find(function (error, skills) {

            if (error) {
                response.status(500).send(error);
                return;
            }

            console.log(skills);

            response.json(skills);
        });
    });

skillRouter
    .route('/skills/:itemId')
    .get(function (request, response) {

        console.log('GET /skills/:itemId');

        var itemId = request.params.itemId;

        Skill.findOne({ id: itemId }, function (error, skill) {

            if (error) {
                response.status(500).send(error);
                return;
            }

            console.log(skill);

            response.json(skill);

        });
    })
    .put(function (request, response) {

        console.log('PUT /skills/:itemId');

        var itemId = request.params.itemId;

        Skill.findOne({ id: itemId }, function (error, skill) {

            if (error) {
                response.status(500).send(error);
                return;
            }

            if (skill) {
                skill.title = request.body.title;
                skill.level = request.body.level;
                skill.goal = request.body.goal;
                skill.time = request.body.frequency;
                skill.timelimit = request.body.timelimit;
                skill.xp = request.body.xp;

                skill.save();

                response.json(skill);
                return;
            }

            response.status(404).json({
                message: 'Skill with id ' + itemId + ' was not found.'
            });
        });
    })
    .patch(function (request, response) {

        console.log('PATCH /items/:itemId');

        var itemId = request.params.itemId;

        Skill.findOne({ id: itemId }, function (error, skill) {

            if (error) {
                response.status(500).send(error);
                return;
            }

            if (skill) {

                for (const property in request.body) {
                    if (request.body.hasOwnProperty(property)) {
                        if (typeof skill[property] !== 'undefined') {
                            skill[property] = request.body[property];
                        }
                    }
                }

                // if (request.body.name) {
                //   item.name = request.body.name;
                // }

                // if (request.body.description) {
                //   item.description = request.body.description;
                // }

                // if (request.body.quantity) {
                //   item.quantity = request.body.quantity;
                // }

                skill.save();

                response.json(skill);
                return;
            }

            response.status(404).json({
                message: 'Skill with id ' + itemId + ' was not found.'
            });
        });
    })
    .delete(function (request, response) {

        console.log('DELETE /items/:itemId');

        var itemId = request.params.itemId;

        Skill.findOne({ id: itemId }, function (error, skill) {

            if (error) {
                response.status(500).send(error);
                return;
            }

            if (skill) {
                skill.remove(function (error) {

                    if (error) {
                        response.status(500).send(error);
                        return;
                    }

                    response.status(200).json({
                        'message': 'Skill with id ' + itemId + ' was removed.'
                    });
                });
            } else {
                response.status(404).json({
                    message: 'Skill with id ' + itemId + ' was not found.'
                });
            }
        });
    });

module.exports = skillRouter;