use strict;
use warnings;
use JSON;

package LecturerLink;

sub new {
  my $class = shift @_;
  return bless {"link_name" => "???","link_category" => "???","session_sem" => "???", "link_description" => "???", "link_url" => "???", "link_owner" => "???"}, $class; # class nye variable is dlm hash
}


sub read {
    my $this = shift @_;
    my $dbh = shift @_;
    my $lecturer_email = shift @_;
    my $sth = undef;
        if ($sth = $dbh->prepare('SELECT lnk.* FROM user u JOIN lecturer_link_assignment lla ON u.user_id = lla.lecturer_id JOIN link lnk ON lla.link_id = lnk.link_id WHERE u.email = ?')) {
            if ($sth->execute($lecturer_email)) {
                my @rows = ();
                while (my $ref = $sth->fetchrow_hashref()) {
                    push(@rows, $ref);
                }
                return JSON->new->pretty->encode(\@rows);
            } else {print "Error: $dbh->errstr()\n";}
        } else {print "Error: $dbh->errstr()\n";}
}

return 1;