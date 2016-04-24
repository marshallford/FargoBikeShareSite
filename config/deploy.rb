require 'mina/git'
require 'mina/npm'
require 'mina/rbenv'

set :domain, 'king'
set :user, 'deploy'
set :port, '22'
set :deploy_to, '/sites/fargobikesharesite'
set :repository, '/home/git/fargobikesharesite.git'
set :branch, 'master'

set :shared_paths, ['log']

task :environment do
  invoke :'rbenv:load'
end

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
