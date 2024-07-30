Rails.application.routes.draw do
  root "pages#home"
  get '/simulate_updates', to: 'pages#simulate_updates', as: 'simulate_updates'
  get '/start_data', to: 'pages#start_data', as: 'start_data'
  
  post '/update_location', to: 'locations#update_location'

  devise_for :users
  #I wanted to play with devise, but finally never got time to add this

end
