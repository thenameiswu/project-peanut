CreateThread(function()
    while true do
        if (NetworkIsSessionStarted()) then
            TriggerEvent('Peanut:Client:PlayerJoin')
            TriggerServerEvent('Peanut:Server:PlayerJoin')

            break;
        end

        Wait(250)
    end
end)