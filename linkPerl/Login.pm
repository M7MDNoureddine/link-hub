use strict;
use warnings;
use JSON;


package Login;



sub new {
  my $class = shift @_;
  return bless {"email" => "???","password" => "???"}, $class; 
}

#when user login
sub login{

    my $this = shift @_;
    
    my $dbh = shift @_;
    my $email = shift @_;
    my $password = shift @_;
    my $sth = undef;
    my @array = ();

    if ($email  && $password ) {
      

         if ($sth = $dbh->prepare('SELECT * FROM user WHERE email = ?')) {
            if ($sth->execute($email)) {
                 my $user_data = $sth->fetchrow_hashref();# mmg kene initialized my dlm ni rather than kt luar sbb bende2 prepeare std ni dikira satu block
                if ($user_data && $user_data->{'password'} eq $password) {
           
                     @array = ($user_data->{'user_type'},$user_data->{'email'});
                    return JSON->new->pretty->encode(\@array);
                }else{
                    @array = ("wrong username/password!!");
                    return JSON->new->pretty->encode(\@array);
                }
            } else {print "error";}
        } else {print "error";}

        
       
    } 
}

return 1;
