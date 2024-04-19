class UnitsController < ApplicationController
    before_action :set_unit, only: [:show, :edit, :update, :destroy]
  
    def index
      @active_units = Unit.where(active: true).paginate(page: params[:page]).per_page(15)
      @inactive_units = Unit.where(active: false).paginate(page: params[:page]).per_page(15)
    end
  
    def new
      @unit = Unit.new
    end
  
    def create
      @unit = Unit.new(unit_params)
      if @unit.save
        flash[:notice] = "Successfully added #{@unit.name} to GCPD."
        redirect_to units_path
      else
        render :new
      end
    end
  
    def show
      @unit = Unit.find(params[:id])
      @officers = @unit.officers.paginate(page: params[:page], per_page: 15) 
      @officer_card = @unit.officers.paginate(page: params[:page], per_page: 1) 
      @open_investigations = @unit.number_of_unique_open_investigations
      @closed_investigations = @unit.number_of_unique_closed_investigations
      @cases_with_batman = @unit.number_of_unique_investigations_involving_batman
    end
  
    def edit
      @unit = Unit.find(params[:id])
    end
  
    def update
      @unit = Unit.find(params[:id])
      if @unit.update(unit_params)
        redirect_to unit_path(@unit), notice: 'Updated unit information'
      else
        render :edit
      end
    end

    def destroy
        if @unit.destroy
          redirect_to units_path, notice: "Removed #{@unit.name} from the system."
        else
          @active_units = Unit.where(active: true).paginate(page: params[:page]).per_page(15)
          @inactive_units = Unit.where(active: false).paginate(page: params[:page]).per_page(15)
          render :index
        end
      end
  
    private
  
    def set_unit
      @unit = Unit.find(params[:id])
    end
  
    def unit_params
      params.require(:unit).permit(:active, :name)
    end
  end
  