use strict;
use warnings;
use JSON;

package Registration;

sub new {
  my $class = shift @_;
  return bless {"email" => "???","password" => "???","user_type" => "???", "Department" => "???"}, $class; # class nye variable is dlm hash
}

sub setInfo { 
  my $this = shift @_; 

  my $email = shift @_;
  my $password = shift @_;
  my $user_type = shift @_;
  my $Department = shift @_;

  $this->{'email'} = $email;
  $this->{'password'} = $password;
  $this->{'user_type'} = $user_type;
  $this->{'Department'} = $Department;
}

# register/create new user
sub register {
    my $this = shift @_;
    
    my $dbh = shift @_;
    my @array = ();
    my $sth = undef;

    if ($sth = $dbh->prepare('SELECT * FROM user WHERE email = ?')) {
            if ($sth->execute($this->{'email'})) {
                my $user_data = $sth->fetchrow_hashref();
                $sth = undef;
                if ($user_data && $user_data->{'email'} eq $this->{'email'}) {
           
                    @array = ("Email already exists in database!");
                    return JSON->new->pretty->encode(\@array);
                }else{
                  if ($sth = $dbh->prepare('INSERT INTO user(email, password, user_type, Department) values (?, ?, ?, ?)')) { 
                    if ($sth->execute($this->{'email'}, $this->{'password'}, $this->{'user_type'}, $this->{'Department'})) {
                      print "Success register new user...\n";
                      @array = ("Registration Successful :)");
                      return JSON->new->pretty->encode(\@array);
                    }else {
                      print "Error: $dbh->errstr()\n";
                   }
                 }else {
                    print "Error: $dbh->errstr()\n";
                  }
                }
            } else {print "error";}
        } else {print "error";}
}

return 1;
