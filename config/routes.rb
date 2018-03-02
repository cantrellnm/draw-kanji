Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'kanji#home'
  get '/about' => 'kanji#about', as: 'about'
  get '/kanji' => 'kanji#index', as: 'all_kanji'
  get '/kanji/:character' => 'kanji#show', as: 'kanji'
  resources :lists
  devise_for :users
end
