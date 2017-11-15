class Api::V1::TestController < Api::V1::BaseController
  def index
    @comments = [{ comment: 'this is updated', number: 3 }]
  end
end
