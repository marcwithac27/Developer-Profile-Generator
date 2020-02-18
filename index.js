const fs = require("fs")
const axios = require("axios")
const inquirer = require("inquirer")
const pdf = require("html-pdf")
const open = require("open")
const generateHTML = require("./generateHTML")



const data = {}
const questions = [{
    type: "input",
    name: "username",
    message: "Enter your GitHub username: ",
},
{
    type: "list",
    name: "color",
    message: "What is your favorite color?",
    choices: ["green", "blue", "pink", "red"],
}];

init();
function init() {
    inquirer
        .prompt(questions)
        .then(function ({ username, color }) {
            const queryURL = `https://api.github.com/users/${username}`;
            const querlURLStar = `https://api.github.com/users/${username}/starred`
            axios.get(queryURL).
                then(function ({ data }) {
                    //console.log(data)
                    axios.get(querlURLStar)
                        .then(function (res) {
                           // console.log(res)
                            const sCount = res.data.map(element => {
                                return element.stargazers_count
                            });
                            const stars = sCount.length;
                            const params = {
                                color: color,
                                username: data.username,
                                avatar_url: data.avatar_url,
                                name: data.name,
                                location: data.location,
                                bio: data.bio,
                                public_repos: data.public_repos,
                                followers: data.followers,
                                following: data.following,
                                github: data.login,
                                stars: stars,
                                html_url: data.html_url,
                                
                            }
                            pdf.create(generateHTML(params)).toFile('./devportfolio.pdf', function (err, res) {
                                if (err) throw (err);
                            })
                        })
                })
        })
}