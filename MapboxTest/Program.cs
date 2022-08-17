using System.Net;
using System.Net.Security;

var builder = WebApplication.CreateBuilder(args);
var _geoServerOrigins = "GeoServerOrigins";
// Add services to the container.
builder.Services.AddHttpContextAccessor();
builder.Services.AddRazorPages();
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy(name: _geoServerOrigins, policy =>
//    {
//        policy//.SetIsOriginAllowed(origin => true).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
//        //.AllowAnyOrigin();
//        //.SetIsOriginAllowed( origin => true).AllowCredentials();
//        .WithOrigins("http://localhost:5068").AllowAnyHeader().AllowAnyMethod().AllowCredentials();

//    });
//});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

//app.UseCors(_geoServerOrigins);

app.UseAuthorization();

app.MapRazorPages();

app.Run();

