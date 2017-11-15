class TopController < ApplicationController
  def index
    gon.comments = [{ comment: 'this is first', number: 3 }]
  end
end
