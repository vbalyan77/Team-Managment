# Gallery

### START ###
1 : clone repo  
2 : run serve script  
3 : use postman collection for work with team-management 


### ENDPOINTS ###  
POST    /auth/register/                      => {email : string, password : string}  
POST    /auth/login/                         => {email : string, password : string}  
POST    /team/                               => {title : string}  
PUT     /team/add-member/                    => {users : ObjectId/Array<ObjectId>}  => headers : team_id
PUT     /team/change-role/                   => {member_id : ObjectId}              => headers : team_id
DELETE  /team/delete-member/                 => {member_id : ObjectId}              => headers : team_id
DELETE  /team/                               => {}                                  => headers : team_id
GET     /team/                               => {}                                  => headers : team_id


### SCRIPTS ###
start - for build js files  
serve - for build ts files  
build - for compile project  
test  - for testing
