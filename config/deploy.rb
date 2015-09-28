require 'mina/git'
require 'mina/npm'

set :domain, 'king'
set :user, 'deploy'
set :port, '22'
set :deploy_to, '/sites/fargobikesharesite'
set :repository, '/home/git/fargobikesharesite.git'
set :branch, 'master'

# This task is the environment that is loaded for most commands, such as
# `mina deploy` or `mina rake`.
task :environment do

end

# Put any custom mkdir's in here for when `mina setup` is ran.
# For Rails apps, we'll make some of the shared paths that are shared between
# all releases.
task :setup => :environment do

end

desc "Deploys the current version to the server."
task :deploy => :environment do
  to :before_hook do
    # Put things to run locally before ssh
  end

  deploy do
    # Put things that will set up an empty directory into a fully set-up
    # instance of your project.
    set_default :npm_options, '--dev'
    # set :shared_paths, ['node_modules']
    invoke :'git:clone'
    # invoke :'deploy:link_shared_paths'
    invoke :'npm:install'
    queue  %[echo "-----> Gulp build"]
    queue %[gulp build]
    invoke :'deploy:cleanup'
  end
end
