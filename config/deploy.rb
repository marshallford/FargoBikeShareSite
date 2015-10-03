require 'mina/git'
require 'mina/npm'
require 'mina/rbenv'

set :domain, 'king'
set :user, 'deploy'
set :port, '22'
set :deploy_to, '/sites/fargobikesharesite'
set :repository, '/home/git/fargobikesharesite.git'
set :branch, 'master'

# Manually create these paths in shared/ (eg: shared/config/database.yml) in your server.
# They will be linked in the 'deploy:link_shared_paths' step.
set :shared_paths, ['log']

# This task is the environment that is loaded for most commands, such as
# `mina deploy` or `mina rake`.
task :environment do
  queue %{
echo "-----> Loading environment"
#{echo_cmd %[source ~/.bashrc]}
}
  invoke :'rbenv:load'
end

# Put any custom mkdir's in here for when `mina setup` is ran.
# For Rails apps, we'll make some of the shared paths that are shared between
# all releases.
task :setup => :environment do
  queue! %[mkdir -p "#{deploy_to}/shared/log"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/log"]
end

desc "Deploys the current version to the server."
task :deploy => :environment do
  deploy do
    set :npm_options, ''
    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'
    invoke :'npm:install'
    queue  %[echo "-----> Gulp build"]
    queue %[gulp build]
    invoke :'deploy:cleanup'
  end
end
