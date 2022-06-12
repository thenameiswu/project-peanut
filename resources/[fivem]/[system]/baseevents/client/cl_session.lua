CreateThread(function()
    while true do
        if (NetworkIsSessionStart()) then
            TriggerEvent('peanut:client:onSessionStart')
            TriggerServerEvent('peanut:client:onSessionStart')

            break;
        end

        Wait(250)
    end
end)