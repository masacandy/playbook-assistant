Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'top#index'
  namespace :api do
    namespace :v1 do
      if Rails.env.development?
        resources :test, only: :index
      end
    end
  end
end
