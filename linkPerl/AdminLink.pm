use strict;
use warnings;
use JSON;

package AdminLink;

sub new {
  my $class = shift @_;
  return bless {"link_name" => "???","link_category" => "???","session_sem" => "???", "link_description" => "???", "link_url" => "???", "link_owner" => "???"}, $class; 
}

sub setInfo { 
  my $this = shift @_; 

  my $link_name = shift @_;
  my $link_category = shift @_;
  my $session_sem = shift @_;
  my $link_description = shift @_;
  my $link_url = shift @_;
  my $link_owner = shift @_;
  
  $this->{'link_name'} = $link_name;
  $this->{'link_category'} = $link_category;
  $this->{'session_sem'} = $session_sem;
  $this->{'link_description'} = $link_description;
  $this->{'link_url'} = $link_url;
  $this->{'link_owner'} = $link_owner;
}


sub create { # create link to database
    my $this = shift @_;
    
    my $dbh = shift @_;
    my $sth = undef;
    
    if ($sth = $dbh->prepare('INSERT INTO link(link_name, link_category, session_sem, link_description,link_url,link_owner) values (?, ?, ?, ?,?,?)')) { # 4 param, 1 question mark for each value of variable
        if ($sth->execute($this->{'link_name'}, $this->{'link_category'}, $this->{'session_sem'}, $this->{'link_description'},$this->{'link_url'},$this->{'link_owner'})) {
            print "Success create new link...\n";
        } else {
            print "Error: $dbh->errstr()\n";
        }
    } else {
        print "Error: $dbh->errstr()\n";
    }
}

sub read { #read link from database
    my $this = shift @_;
    my $dbh = shift @_;
    my $link_owner = shift @_;
    my $sth = undef;
        if ($sth = $dbh->prepare('SELECT * FROM link WHERE link_owner=?')) {
            if ($sth->execute($link_owner)) {
                my @rows = ();

                while (my $ref = $sth->fetchrow_hashref()) {
                    push(@rows, $ref);
                }
                return JSON->new->pretty->encode(\@rows);
            } else {print "Error: $dbh->errstr()\n";}
        } else {print "Error: $dbh->errstr()\n";}
}

sub readUpdate { #read specific link for update purpose
    my $this = shift @_;
    my $dbh = shift @_;
    my $link_id = shift @_;
    my $sth = undef;
    
        if ($sth = $dbh->prepare('SELECT * FROM link WHERE link_id=?')) {
            if ($sth->execute($link_id)) {
                my $ref = $sth->fetchrow_hashref();
                return JSON->new->pretty->encode($ref);
            } else {print "Error: $dbh->errstr()\n";}
        } else {print "Error: $dbh->errstr()\n";}
}
sub readLect { #read lecturer that has been assign the specific link
    my $this = shift @_;
    my $dbh = shift @_;
    my $link_id = shift @_;
    my $sth = undef;
    
        if ($sth = $dbh->prepare('SELECT email FROM lecturer_link_assignment JOIN user ON lecturer_link_assignment.lecturer_id = user.user_id WHERE lecturer_link_assignment.link_id =?')) {
            if ($sth->execute($link_id)) {
                 my @rows = ();

                while (my $ref = $sth->fetchrow_hashref()) {
                    push(@rows, $ref);
                }
                return JSON->new->pretty->encode(\@rows);
            } else {print "Error: $dbh->errstr()\n";}
        } else {print "Error: $dbh->errstr()\n";}
    
   
}
sub readUnassignLect { #read lecturer that has not been assigned to the specific link yet
    my $this = shift @_;
    my $dbh = shift @_;
    my $link_id = shift @_;
    my $link_owner = shift @_;
    my $sth = undef;
    
        if ($sth = $dbh->prepare('SELECT u.email FROM user u LEFT JOIN lecturer_link_assignment lla ON u.user_id = lla.lecturer_id AND lla.link_id = ? WHERE lla.lecturer_id IS NULL AND u.email <> ?')) {
            if ($sth->execute($link_id,$link_owner)) {
                 my @rows = ();

                while (my $ref = $sth->fetchrow_hashref()) {
                    push(@rows, $ref);
                }
                return JSON->new->pretty->encode(\@rows);
            } else {print "Error: $dbh->errstr()\n";}
        } else {print "Error: $dbh->errstr()\n";}    
}
sub assignLink { #assign lecturer to specific link
    my $this = shift @_;
    my $dbh = shift @_;
    my $link_id = shift @_;
    my $lecturerList = undef;
    $lecturerList = shift @_;
    my $sth = undef;

    for(my $j=0;$j<scalar(@$lecturerList);$j++){
        $sth = undef;
         if ($sth = $dbh->prepare('SELECT user_id FROM user WHERE email = ?')) {
            if ($sth->execute($lecturerList->[$j])) {
                my $ref = $sth->fetchrow_hashref();
                $sth = undef;
                if ($sth = $dbh->prepare('INSERT INTO lecturer_link_assignment(link_id,lecturer_id) VALUES (?,?)')) { 
                    if ($sth->execute($link_id,$ref->{"user_id"})) {
                        print "Success assign link to lecturer...\n";
                        print $ref->{"user_id"};
                    } else {print "wait a second...";}
                } else {print "wait a second...";}
                
            } else {print "Error select userid: $dbh->errstr()\n";}
        } else {print "Error select userid: $dbh->errstr()\n";}
    }
}

sub update {#update link 
    my $this = shift @_;    
    my $dbh = shift @_;
    my $link_name = shift @_;
    my $link_description = shift @_;
    my $session_sem = shift @_; 
    my $link_url = shift @_;
    my $link_category = shift @_;
    my $link_id = shift @_;
    my $sth = undef;
    
    if ($sth = $dbh->prepare('UPDATE link SET link_name=?, link_category=?, session_sem=?, link_description=?,link_url=? WHERE link_id=?')) {
        if ($sth->execute($link_name,$link_category,$session_sem,$link_description,$link_url, $link_id)) {
            print "Success update the link...\n";
        } else {
            print "Error: $dbh->errstr()\n";
        }
    } else {
        print "Error: $dbh->errstr()\n";
    }
}

sub delete { # delete link
    my $this = shift @_;
    
    my $dbh = shift @_;
    my $link_id = shift @_;
    my $sth = undef;
    
    if ($sth = $dbh->prepare('DELETE FROM link WHERE link_id=?')) {
        if ($sth->execute($link_id)) {
            print "Success delete link...\n";
            
        } else {
            print "Error: $dbh->errstr()\n";
        }
    } else {
        print "Error: $dbh->errstr()\n";
    }

}

return 1;