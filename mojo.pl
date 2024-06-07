use strict;
use warnings;
use Mojolicious::Lite -signatures;
use JSON;
use DBI;
use lib './';
use lib './linkPerl';
use AdminLink; 
use LecturerLink;
use Login;
use Registration;
use lib './linkHtml';

my $database = "linkHub";
my $hostname = "localhost";
my $username = "qayyim";
my $password = "qayyim123";

my $dsn = "DBI:mysql:database=$database;host=$hostname";
my $dbh = DBI->connect($dsn, $username, $password);


get '/' => sub($c) {
   $c->redirect_to('/linkHtml/login.html');
};


post '/register' => sub ($c) {
   my $email = $c->param('email');
   my $password = $c->param('password');
   my $user_type = $c->param('user_type');
   my $Department = $c->param('Department');
   my $s = new Registration;
   $s->setInfo($email,$password,$user_type,$Department);
   ### Disable CORS policy by browser
   $c->res->headers->header('Access-Control-Allow-Origin'=>'*');
   $c->render(text => $s->register($dbh));
};

post '/login' => sub ($c) {
   my $email = $c->param("emaillogin"); 
   my $password = $c->param("passlogin");
   my $s = new Login;
   
   ### Disable CORS policy by browser
   $c->res->headers->header('Access-Control-Allow-Origin'=>'*');
   $c->render(text => $s->login($dbh, $email , $password));
};

get '/create' => sub ($c) {
   my $name = $c->param('linkName');
   my $desc = $c->param('linkDesc');
   my $sem = $c->param('sessionSem');
   my $url = $c->param('linkUrl');
   my $category = $c->param('linkCategory');
   my $owner = $c->param('link_owner');
   my $s = new AdminLink;
   $s->setInfo($name, $category,$sem,$desc,$url,$owner);
   $s->create($dbh);
   
   ### Disable CORS policy by browser
   $c->res->headers->header('Access-Control-Allow-Origin'=>'*');
   
   $c->render(text => "Create row ...");
};

##read all link belong to an admin
get '/readAdminPage' => sub ($c) {
   my $link_owner = $c->param("link_owner"); 
   my $s = new AdminLink;
   
   ### Disable CORS policy by browser
   $c->res->headers->header('Access-Control-Allow-Origin'=>'*');
   $c->render(text => $s->read($dbh, $link_owner));
};

#read all link belong to a lecturer
get '/readLecturerPage' => sub ($c) {
   my $lecturer_email = $c->param("user_email"); 
   my $s = new LecturerLink;
   
   ### Disable CORS policy by browser
   $c->res->headers->header('Access-Control-Allow-Origin'=>'*');
   $c->render(text => $s->read($dbh, $lecturer_email));
};

get '/readUpdate' => sub ($c) {
   my $link_id = $c->param("link_id"); 
   my $s = new AdminLink;
   
   ### Disable CORS policy by browser
   $c->res->headers->header('Access-Control-Allow-Origin'=>'*');
   $c->render(text => $s->readUpdate($dbh, $link_id));
};
get '/readLect' => sub ($c) {
   my $link_id = $c->param("link_id"); 
   my $s = new AdminLink;

   ### Disable CORS policy by browser
   $c->res->headers->header('Access-Control-Allow-Origin'=>'*');
   $c->render(text => $s->readLect($dbh, $link_id));
};
get '/readUnassignLect' => sub ($c) {
   my $link_id = $c->param("link_id"); 
   my $s = new AdminLink;
   my $link_owner = $c->param("link_owner");

   ### Disable CORS policy by browser
   $c->res->headers->header('Access-Control-Allow-Origin'=>'*');
   $c->render(text => $s->readUnassignLect($dbh, $link_id,$link_owner));
};

get '/assignLink' => sub ($c) {
   
   #lecturerList is an array reference not normal array
   my $lecturerList = undef;
   $lecturerList = from_json($c->param('LecturerList'));
   my $link_id = $c->param('link_id');
   my $s = new AdminLink;
   $s->assignLink($dbh,$link_id,$lecturerList);
   $c->res->headers->header('Access-Control-Allow-Origin'=>'*');
   $c->render(text => "assign Link...  link id=$link_id");
};

get '/update' => sub ($c) {
   my $name = $c->param('UlinkName');
   my $desc = $c->param('UlinkDesc');
   my $sem = $c->param('UsessionSem');
   my $url = $c->param('UlinkUrl');
   my $category = $c->param('UlinkCategory');
   my $link_id = $c->param('link_id');
  
   
   my $s = new AdminLink;
   $s->update($dbh, $name,$desc,$sem,$url,$category,$link_id);
   
   $c->res->headers->header('Access-Control-Allow-Origin'=>'*');
   $c->render(text => "Update row...  link id=$link_id");
};

get '/delete' => sub ($c) {
   my $link_id = $c->param("link_id");
   my $s = new AdminLink;
   $s->delete($dbh, $link_id);
   
   $c->res->headers->header('Access-Control-Allow-Origin'=>'*');
   $c->render(text => "You have successfully delete link..");
};

app->start;